---
title: SMTS
description: Pre-launch rebuild of a smart-home installer's website, moved from an outdated WordPress codebase to Next.js and Payload CMS.
status: pre-launch
featured: true
date: 2026-11-18
cover: /projects/smts/cover.webp
coverAlt: SMTS home page on desktop. The hero offers turnkey smart-home design and installation, with a button to book a demonstration and the company's phone and messenger contacts in the header.
technologies:
  [nextjs, payload-cms, react, typescript, tailwindcss, postgresql, playwright]
---

**Status: pre-launch.** The rebuilt site is not public yet. The client's
current domain still serves the old WordPress site, so there is no live demo.
The screenshots come from an isolated build with sample data.

## The problem

SMTS (Smart Technology Systems) designs and installs smart-home systems. Its
website ran on an outdated WordPress codebase that was hard to update.

## What I did

With AI assistance, I:

- migrated the WordPress codebase to Next.js, with Payload CMS for content;
- refined the UI;
- set up deployment;
- optimised SEO;
- integrated Telegram for lead notifications.

## The visitor workflow

Visitors explore smart-home scenarios, then answer six questions about their
home. Their answers carry into the contact step, so the request arrives with
that context.

![SMTS cost estimate quiz on a phone, at question 3 of 6: a slider sets the number of rooms to 5, with a button to go to the next question.](/projects/smts/mobile-quiz.webp)

## How it is tested

Playwright tests in the project repository check:

- the quiz interactions;
- that content published in the CMS appears on the public page;
- lead delivery, against a mock service.
