---
title: NysaNet
description: Pre-launch fiber website rebuild that carries a household's town, building type and plan into its installation request.
status: pre-launch
date: 2026-11-26
cover: /projects/nysanet/cover.webp
coverAlt: NysaNet pricing page with Nysa and single-family homes selected. Four fiber plans are shown side by side, including Srebrna PLUS.
technologies:
  [nextjs, payload-cms, react, typescript, tailwindcss, postgresql, playwright]
---

**Pre-launch.** At the last check, the public homepage still served the
WordPress site. The November 26, 2026 screenshots show an isolated build.

## The problem

Households need to know which fiber plans are available in their town and
building type before requesting installation.

## What I did

With AI assistance, I migrated the WordPress codebase to Next.js and Payload
CMS, refined the UI, set up deployment, optimized SEO, and integrated Telegram.
The rebuilt site can seed its initial WordPress content and media into Payload
from bundled files, without connecting to the old site.

## The visitor workflow

A visitor selects Nysa, switches between single-family homes and apartment
blocks, and compares the available plans. Choosing Srebrna PLUS for a house
carries Nysa, the building type, and the plan into the installation form.

![NysaNet installation form on mobile with Nysa, single-family home and Srebrna PLUS already selected. Contact and street address fields are blank.](/projects/nysanet/mobile-installation.webp)

## How it is tested

A Playwright test opens the Nysa offer from the pricing list, checks that the
Srebrna PLUS order link carries all three selections, and verifies that
switching to apartment blocks changes the available plan.
