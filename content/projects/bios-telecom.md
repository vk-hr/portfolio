---
title: BIOS Telecom
description: I designed and built this website for an internet and TV provider in WordPress, then rebuilt it with Next.js and Payload CMS.
status: pre-launch
date: 2026-11-26
cover: /projects/bios-telecom/cover.webp
coverAlt: BIOS Telecom homepage offering fiber internet and TV for homes and businesses, with buttons to request connection or view plans.
technologies:
  [nextjs, payload-cms, react, typescript, tailwindcss, postgresql, playwright]
---

**Pre-launch.** At the last check, the public site showed a maintenance page.
The cover shows the rebuilt homepage from an isolated build.

## The problem

Households need to see which internet plans serve their locality and what the
bundle includes when they add TV.

## What I did

I designed and developed the original WordPress site and maintained it myself
for several years. I then rebuilt it with Next.js and Payload CMS with AI
assistance, aiming to reduce page load times and improve the user experience.
During the rebuild, I refined the UI, set up deployment, optimized SEO, and
integrated Telegram.

## The visitor workflow

A visitor chooses a locality such as Kolomyia and compares the internet plans
available there. Adding a SWEET.TV tier updates the comparison with bundled
prices. The URL preserves the locality and TV selection, and the connection
dialog carries the selected locality into the request.

## How it is tested

Playwright tests check that the internet explorer opens with the region
picker, that the SWEET.TV page renders its plans, and that a connection request
creates a lead in the test database.
