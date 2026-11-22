---
title: Portfolio
description: This site. A server-rendered TanStack Start app whose content lives in Markdown files next to the code.
status: active
featured: true
date: 2023-09-18
repository: https://github.com/vk-hr/portfolio
technologies: [react, typescript, tanstack-start, tailwindcss, bun]
---

A personal portfolio built with TanStack Start and React 19.

## How it works

- Projects are Markdown files in `content/projects/`, validated with Zod at build time.
- Pages are server-rendered on Vercel; the theme preference is a cookie, so the
  first paint always matches it.
- Styling is Tailwind CSS 4 with shadcn components on Base UI.
