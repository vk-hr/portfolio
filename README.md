# Portfolio

My personal portfolio site. Projects are Markdown files in this repository;
there is no backend, database or CMS.

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, server-rendered via
  Nitro)
- [Content Collections](https://www.content-collections.dev) for Markdown/YAML
  content, validated with Zod
- Tailwind CSS 4 and [shadcn](https://ui.shadcn.com) components on Base UI
- [Bun](https://bun.com) for installing, testing, type checking and formatting;
  Biome for linting
- Deployed on Vercel

## Running locally

Requires Bun (see `packageManager` in `package.json`). On Nix, `nix develop`
(or direnv with the included `.envrc`) provides it. No environment variables
are needed.

```bash
bun install      # installs dependencies and generates the content module
bun dev          # http://localhost:3000
```

Other commands:

```bash
bun run build    # production build into .output/
bun run preview  # serve the production build
bun test         # tests
bun check        # type check
bun fmt          # format
bun lint         # lint
```

## Adding a project

Create `content/projects/<slug>.md`. The filename becomes the URL
(`/projects/<slug>`) and must be kebab-case.

```markdown
---
title: My Project
description: One or two sentences shown on cards and in the page description.
status: active # active | completed | archived (archived is hidden)
featured: true # optional, lists it under featured on the home page
date: 2026-01-15
repository: https://github.com/you/my-project # optional
demo: https://my-project.example.com # optional
cover: /projects/my-project/cover.webp # optional, file under public/
technologies: [react, typescript]
---

Write the project page here in Markdown. GitHub-flavored Markdown
(tables, task lists, strikethrough) is supported.
```

The frontmatter is validated at build time; an invalid field fails the build
with an error pointing at the file.

## Adding a technology

Technologies used in a project's `technologies` list must be defined in
`content/technologies.yaml`:

```yaml
astro:
  name: Astro
  color: violet
```

The key is the slug used in project frontmatter. `color` is one of the keys in
`src/lib/colors.ts` (red, orange, amber, yellow, lime, green, emerald, cyan,
blue, indigo, violet, pink). Referencing an undefined slug fails the build.

## Deploying

Vercel deploys through its Git integration: `main` to production, other
branches as previews. Server functions run on Vercel's Bun runtime
(`bunVersion` in `vercel.json`). Pages are server-rendered rather than
prerendered because the theme is read from a cookie on each request.

CI (`.github/workflows/ci.yml`) checks formatting, lint, types, tests and the
build on every push to `main` and every pull request.
