---
title: NysaNet
description: I designed and built this fiber broadband website in WordPress, then rebuilt it with Next.js and Payload CMS.
status: pre-launch
date: 2026-11-26
cover: /projects/nysanet/cover.webp
coverAlt: NysaNet homepage promoting home fiber broadband beside a family photo, with buttons to view pricing or request installation.
technologies:
  [nextjs, payload-cms, react, typescript, tailwindcss, postgresql, playwright]
---

**Pre-launch.** At the last check, the public homepage still served the
WordPress site. The cover shows the rebuilt homepage from an isolated build.

## The problem

Households need to know which fiber plans are available in their town and
building type before requesting installation.

## What I did

I designed and developed the original WordPress site and maintained it myself
for several years. I then rebuilt it with Next.js and Payload CMS with AI
assistance, aiming to reduce page load times and improve the user experience.
During the rebuild, I refined the UI, set up deployment, optimized SEO, and
integrated Telegram.
The rebuilt site can seed its initial WordPress content and media into Payload
from bundled files, without connecting to the old site.

## The visitor workflow

A visitor selects Nysa, switches between single-family homes and apartment
blocks, and compares the available plans. Choosing Srebrna PLUS for a house
carries Nysa, the building type, and the plan into the installation form.

## How it is tested

A Playwright test opens the Nysa offer from the pricing list, checks that the
Srebrna PLUS order link carries all three selections, and verifies that
switching to apartment blocks changes the available plan.
