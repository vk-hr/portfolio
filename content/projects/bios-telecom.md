---
title: BIOS Telecom
description: Pre-launch telecom website rebuild that lets visitors compare internet plans by locality and add a TV tier.
status: pre-launch
date: 2026-11-26
cover: /projects/bios-telecom/cover.webp
coverAlt: BIOS Telecom desktop tariff comparison showing three PON internet speeds bundled with the same SWEET.TV tier.
technologies:
  [nextjs, payload-cms, react, typescript, tailwindcss, postgresql, playwright]
---

**Pre-launch.** At the last check, the public site showed a maintenance page.
The November 26, 2026 screenshots show an isolated build.

## The problem

Households need to see which internet plans serve their locality and what the
bundle includes when they add TV.

## What I did

With AI assistance, I migrated the WordPress codebase to Next.js and Payload
CMS, refined the UI, set up deployment, optimized SEO, and integrated Telegram.

## The visitor workflow

A visitor chooses a locality such as Kolomyia and compares the internet plans
available there. Adding a SWEET.TV tier updates the comparison with bundled
prices. The URL preserves the locality and TV selection, and the connection
dialog carries the selected locality into the request.

![BIOS Telecom's SWEET.TV page on mobile showing provider details and two visible TV plans, each with a connect button.](/projects/bios-telecom/mobile-tv-plans.webp)

## How it is tested

Playwright tests check that the internet explorer opens with the region
picker, that the SWEET.TV page renders its plans, and that a connection request
creates a lead in the test database.
