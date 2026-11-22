# AGENTS.md

This file provides guidance to coding agents working in this repository.

A personal portfolio with no backend: TanStack Start (React 19, SSR via Nitro),
content from Markdown/YAML via Content Collections, deployed to Vercel.

## Commands

```bash
bun install                  # also runs postinstall: content-collections build
bun dev                      # bun --bun vite dev --port 3000
bun run build                # bun --bun vite build
bun run preview              # bun --bun vite preview

bun test --isolate           # all tests, as CI runs them (random order is on in bunfig)
bun test src/lib/projects    # tests matching a path
bun --bun vite build && bun test ./e2e/ssr.e2e.ts  # SSR smoke tests on the build
bun check                    # type check (Bun built-in, same errors as tsc 7)
bun fmt                      # format (config in bunfig.toml [fmt])
bun fmt --check              # check formatting only
bun lint                     # package.json "lint" script = biome lint
```

CI (`.github/workflows/ci.yml`) runs four independent jobs, each with its own
checkout and `bun install --frozen-lockfile` (`.github/actions/setup`):
`checks` (`bun fmt --check` and `bun lint`, both always run so every failure
is listed), `typecheck` (`bun check`), `test` (`bun test --isolate`) and
`build` (`bun --bun vite build`, then the SSR smoke tests). No job waits on another. The pre-push hook
runs the same commands. Run the same before handing work back.

CI policy:

- **Budgets:** `fmt` 1 s, `lint` 1 s, `typecheck` 5 s, tests 30 s, each
  job 35 s (`.github/scripts/budget.sh`, `.github/actions/budget`). Over budget
  fails the job. Make the check faster; never raise a budget, add retries or
  skip tests to get green. Setup (15 s) only warns while CI is on
  GitHub-hosted runners.
- **No test selection.** The full suite runs on every PR and on main.
  `bun test --changed` follows imports only. It misses `content/` (which
  reaches tests through the generated `content-collections` module),
  `bunfig.toml` and the `test/` preloads, and it passed a run that broke
  `test/setup.ts`. The full suite takes under 1 s, so selection saves nothing.

Always use `bun` (never npm/yarn/pnpm).

## Architecture

- **Framework:** TanStack Start with file-based routing in `src/routes/`.
  `src/routeTree.gen.ts` is generated — never edit it.
- **SSR is intentional.** The theme (`start-theme` package) is stored in a
  cookie and read by a server function in `src/functions/theme.ts`, which the
  root route (`src/routes/__root.tsx`) calls in its loader. Pages must not be
  prerendered or the first paint would not match the theme.
- **Deploy:** Vercel, with server functions on Vercel's Bun runtime
  (`vercel.json` `bunVersion: "1.4.x"`). Nitro picks the Vercel preset
  automatically.
- **Build:** Vite 8 (Rolldown) with Nitro. React Compiler is active via
  `@rolldown/plugin-babel` + `reactCompilerPreset` — no manual
  `useMemo`/`useCallback`/`memo`. Components using `motion` opt out with
  `"use no memo"`; keep that directive where it is.
- **Routes** (`src/routes/_home/`, pathless layout `route.tsx`):
  - `/` → `index.tsx`
  - `/projects` → `projects/index.tsx`
  - `/projects/$slugId` → `projects/$slugId.tsx`; unknown slug throws
    `notFound()`

  Route-private components use the `-` prefix (`-header.tsx`, `-layout.tsx`,
  ...) so the router ignores them.

- **Data flow:** route loaders call the synchronous helpers in
  `src/lib/projects.ts` and components read `Route.useLoaderData()`. There is
  no TanStack Query, no database and no environment variables.

## Content

Content Collections, configured in `content-collections.ts`:

- `content/projects/*.md` — one file per project. The filename (without `.md`)
  is the slug and URL. YAML frontmatter is validated by Zod: `title`,
  `description`, `status` (`active` | `completed` | `archived`), `featured`
  (default `false`), `date` (ISO `YYYY-MM-DD`), optional `repository` / `demo`
  (URLs), optional `cover` (path under `public/`, starting with `/`),
  `technologies` (array of slugs). The Markdown body is compiled to HTML at
  build time with `remark-gfm` and rendered by
  `src/components/markdown-content.tsx`.
- `content/technologies.yaml` — map of kebab-case slug → `{ name, color }`.
  `color` must be a key of `COLORS` in `src/lib/colors.ts`. A project that
  references an unknown technology slug fails the build.
- The generated module `content-collections` (aliased in `tsconfig.json` to
  `.content-collections/generated`, gitignored) is rebuilt by the Vite plugin
  in dev/build and by `postinstall`. If `bun check` cannot find it, run
  `bun install` or `bunx --bun content-collections build`.
- Read content only through `src/lib/projects.ts`: `listProjects(limit?)`,
  `listFeaturedProjects(limit?)`, `getProject(slug)`. Archived projects are
  hidden everywhere; results are sorted newest first.

## UI

- Tailwind CSS 4 (`src/styles.css`, `@tailwindcss/typography` for Markdown).
- shadcn on Base UI, preset `b2CRD5abo`: style `base-lyra`, base color mist,
  theme emerald, hugeicons. Config in `components.json`. Re-applying the
  preset overwrites `src/styles.css` tokens and fonts — reapply the design
  below afterwards.
  - Add/update a component: `bunx --bun shadcn add <name> --overwrite --yes`
  - Re-apply or inspect the preset: `bunx --bun shadcn apply b2CRD5abo` /
    `bunx --bun shadcn preset decode b2CRD5abo`
  - shadcn may create `src/lib/utils.ts` — delete it. `cn` comes from the `cn`
    package: `import { cn } from "cn"`.
- **Design: grotesque minimal.** Schibsted Grotesk (sans, headings and body)
  - Geist Mono (labels), both via `@fontsource-variable/*`. Near-monochrome
    tokens with a single emerald accent (`primary`), square corners
    (`--radius: 0`), 2px rules, diamond corner marks (`CornerSquare`) and the
    diagonal hatch (`bg-diagonal-dashed`) behind the framed column.
  * Custom utilities in `src/styles.css`: `type-display` (oversized headline),
    `type-label` (small uppercase mono for indexes, meta and nav),
    `bg-diagonal-dashed`. Don't name custom utilities `text-*`: `cn`
    (tailwind-merge) treats them as text colours and drops one of the two.
  * Pages use `Page` from `src/routes/_home/-layout.tsx` (header, framed
    `main#main`, footer) and `SectionHeading` for ruled section bars.
    Technologies and status render through `src/components/tech-list.tsx`.
  - **View transitions:** native, started by the router on every navigation
    (`defaultViewTransition` in `src/router.tsx`, which also sets the
    transition type `to-project` / `from-project` / `page`). React's
    `<ViewTransition>` and Motion's `<AnimateView>` don't fire here: TanStack
    Router commits route changes through `useSyncExternalStore`, which React
    never renders as a transition.
    - Shared parts get names from `morph()` / `<MorphFrame>` in
      `src/components/project-morph.tsx`: the home modal (frame, title,
      cover), the `/projects` rows (title) and the project page (frame,
      title, cover). Names must be unique per page, so the home cards are
      never named, and the modal's "Full project" link must not close the
      modal before navigating.
    - Rules that keep the morph clean: the frame is an empty surface (not a
      snapshot of the content), and it is transparent on the project page;
      titles are `w-fit` with identical weight, tracking and `leading-none`;
      covers are `aspect-[2/1]` on both sides. Timing, layer order and the
      "show only the larger title" rule are in `src/styles.css`.
- Icons: `@hugeicons/react` + `@hugeicons/core-free-icons`.
- Animations: `motion`.

## Tooling

Everything is Bun-native except linting.

- **Tests:** `bun test`. Tests live next to the code as `*.test.ts(x)`.
  `bunfig.toml` `[test]` preloads `test/happydom.ts` (registers happy-dom) and
  `test/setup.ts` (Testing Library cleanup + jest-dom matchers). Matcher types
  are in `test/matchers.d.ts`. Import test APIs from `bun:test`.
- **SSR smoke tests:** `e2e/ssr.e2e.ts` starts the built server
  (`.output/server/index.mjs`) and checks every route over HTTP: status codes
  (404s included), titles and meta tags, the `/projects` order, the
  stylesheet, and the theme cookie reaching the pre-paint script. Plain
  `bun test` skips it because of the `*.e2e.ts` name. Run it with the file path
  after a build. Pages, loaders and `head()` are tested here, not with unit
  tests.
- **What to test:** behaviour that can break, not markup. Pure logic goes in
  `src/lib` and is tested there (inject data, e.g.
  `createProjectStore(fixtures)`, rather than depending on `content/`).
  Interactive components are tested through roles and labels with Testing
  Library. Render anything with `<Link>` via `test/render-with-router.tsx`.
  `test/setup.ts` turns Motion animations off. A component whose
  `AnimatePresence` child shares a `layoutId` never unmounts in happy-dom; see
  `src/routes/_home/-projects.test.tsx` for the stand-in.
- **Types:** `bun check`. The `typescript` devDependency is pinned to the
  version Bun bundles; don't bump it independently.
- **Format:** `bun fmt`, configured in `bunfig.toml` `[fmt]`: tabs, sorted
  imports, sorted `package.json`, Tailwind class sorting inside `cn`/`cva`.
- **Lint:** Biome, lint-only (`biome.json`; formatter and assist disabled),
  run through the `lint` script.
- **Git hooks:** hk (`hk.pkl`), installed by the Nix dev shell's
  `shellHook`. Pre-commit formats and lints the staged files and re-stages
  fixes; pre-push runs the CI commands on the whole repo and lists every
  failure. Keep the pre-push steps identical to `.github/workflows/ci.yml`.
  Don't bypass them (`--no-verify`, `HK=0`); fix what they report.
- **Gotcha:** a `package.json` script named like a Bun built-in (`check`,
  `fmt`, `test`, `lint`) shadows the built-in. Don't add such scripts; `lint`
  is the one temporary exception.
- **Environment:** NixOS. `flake.nix` provides `bun` (nixos-unstable);
  `.envrc` is `use flake`, so direnv loads it. `packageManager: bun@1.4.4` in
  `package.json` pins the Bun version CI installs via `oven-sh/setup-bun`.

- **Test failures:** until 2026-12-06, log every test failure you fix in
  `docs/test-failures.md` as `regression`, `change-detector` or `flaky`.
  The log decides which test files are deleted afterwards.

## Conventions

- Named exports only (no default exports), except where a tool requires one
  (`vite.config.ts`, `content-collections.ts`).
- Path alias `#/*` → `src/*` (`package.json` `imports` + `tsconfig.json`
  `paths`).
- Tab indentation, double quotes.
- Always use `bun`.

## Planned

When Bun ≥ 1.4.5 lands in nixpkgs:

- Replace Biome with native `bun lint`: configure `[lint]` in `bunfig.toml`
  with `typeAware = true`, add `@tanstack/eslint-plugin-router`, then remove
  the `lint` script, `biome.json` and `@biomejs/biome`.
- Switch the test preload to `[test] environment = "happy-dom"` and drop
  `test/happydom.ts`.
- Bump `packageManager` to match.
