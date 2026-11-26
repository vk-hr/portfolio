---
title: start-theme
description: SSR-driven theming for TanStack Start. The theme lives in a cookie, so the server always knows it.
status: active
featured: true
date: 2026-10-30
repository: https://github.com/vk-hr/start-theme
package: https://www.npmjs.com/package/start-theme
technologies: [react, typescript, tanstack-start]
---

Most theme libraries keep the theme in `localStorage`, so the server renders
against a guess. `start-theme` stores it in a cookie read by the root loader
instead.

- No flash of the wrong theme: an inline script applies the class before first paint.
- Follows `prefers-color-scheme` live and syncs across tabs.
- Zero dependencies; peers are TanStack Start, TanStack Router and React 19.
