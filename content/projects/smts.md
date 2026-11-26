---
title: SMTS
description: I designed and built this site for a smart-home installer in WordPress, then rebuilt it with Next.js and Payload CMS.
status: pre-launch
featured: true
date: 2026-11-18
cover: /projects/smts/cover.webp
coverAlt: SMTS homepage showing a phone with smart-home controls, a heading about design and installation, and a button to explore system features.
technologies:
  [nextjs, payload-cms, react, typescript, tailwindcss, postgresql, playwright]
---

**Status: pre-launch.** The rebuilt site is not public yet. The client's
domain, [smts.com.ua](https://smts.com.ua), still serves the WordPress site I
built, so there is no live demo of the rebuild.
The cover shows the rebuilt homepage from an isolated build with sample data.

## The problem

SMTS (Smart Technology Systems) designs and installs smart-home systems. Its
original WordPress codebase had become hard to update.

## What I did

I designed and developed the original WordPress site and maintained it myself
for several years. I then rebuilt it with Next.js and Payload CMS with AI
assistance, aiming to reduce page load times and improve the user experience.
During the rebuild, I refined the UI, set up deployment, optimized SEO, and
integrated Telegram for lead notifications.

All three client sites I rebuilt (NysaNet, SMTS and BIOS Telecom) live in
one Turborepo monorepo. Shared packages handle SEO, lead intake and Telegram
delivery, request security and CMS access rules, so a fix or improvement
reaches every site at once.

## The visitor workflow

Visitors explore smart-home scenarios, then answer six questions about their
home. Their answers carry into the contact step, so the request arrives with
that context.

## How it is tested

Playwright tests in the project repository check:

- the quiz interactions;
- that content published in the CMS appears on the public page;
- lead delivery, against a mock service.
