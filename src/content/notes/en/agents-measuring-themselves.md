---
title: "Two weeks, 81,802 lines of agents checking themselves, 745 lines of product"
description: "I asked my agents to make the system reliable. They grew self-checking code 110 times faster than the product, and no instrument noticed."
date: 2026-10-05
author: alexandre
claim: "In the two weeks to 12 September 2026, my agent fleet grew its self-measurement code 110 times faster than the product it serves, and what stopped it was a human question, not an instrument."
verdict: bad
evidence:
  - label: "Line and commit counts over two weeks from the platform's git history, measured and committed 12 September 2026"
  - label: "Session count from local Claude Code logs over the same window: 625 of 698 sessions inside the platform's own repository"
  - label: "Read-only lessons review written by an agent on 13 September 2026, cross-checked against the commits it cites"
models: []
tags: [agents, reliability, metrics, agent-fleets, retrospective]
translationSlug: "des-agents-qui-se-mesurent"
---

For two weeks I asked my agents to make the system more reliable. They did exactly that, in the most literal way available.

Measured on 12 September 2026, over the previous fourteen days: the product grew by 745 lines. The code that measures the system grew by 81,802. That is a ratio of 110 to 1. In commits, 17 against 504. And of the 698 Claude Code sessions run on my laptop in that window, 625 were sessions working on the platform itself.

Some background. I run a fleet of always-on agents that share one memory and one task queue. To keep them honest, I had them write small automated checks, each one asserting a fact about the system: this job ran, this file is current, this service answers. A failing check is red. An agent finds a red, fixes it, and writes another check so the problem can't come back.

Every step of that is reasonable. Each check is defensible on its own, and each fix was real.

Here is the sum. 267 of those checks gated nothing at all: the pipeline that decides whether a change ships referenced none of them. They ran, they turned red or green, and nothing depended on the answer. Two of them had been red every day for a week about a real problem (the instruction files every session loads had grown too long). What closed them in the end was me getting annoyed.

What stopped the whole thing was also me. On the evening of 11 September I asked, roughly, whether we had spent two weeks and millions of tokens building something worse than the handful of prompts we started with. Not one of the instruments had raised that question, because none of them was built to.

## The mechanism

Every check measured a level. Is this true right now? Yes or no.

None measured a direction. Is the list of broken things getting shorter?

An agent rewarded for finding reds and turning them green will produce more checks, because each new check is a fresh chance to find a red. The count of checks went from 22 to 88 in three weeks, so even the number of failures meant nothing on its own: it could rise while things improved, simply because there were more things being measured. It's the gym member who spends the session filming their form from three angles and never loads the bar. Lots of activity, all of it about the activity.

## What changed

On 12 September the self-measurement work was frozen. The same day an agent added a net counter: every run now records its results, and the report leads with the change against the previous run (share passing, and which checks flipped) before it shows the list. The question it answers is the one nobody was asking: are we winning?

The freeze also forced the honest half of the accounting. The service layer is load-bearing: the shared memory is read on every session start, and two of the seventeen product commits fixed paths that had been silently dead. Fixing the two week-old reds gave back about 3,000 tokens on every prompt in every project, because the always-loaded instructions shrank from 73,374 bytes to 61,192. Not all of it was waste. Most of it was.

## What you can do with this

If you let agents improve their own reliability, track one number above the others: is the list of failures shrinking, week on week? A count of checks is not that number. Neither is a pass rate on a population that keeps growing.

And once a week, split your commits into "touched the product" and "touched the machinery around it". If the second pile is bigger for more than a few days, ask why before an agent explains it to you.

The limit: this is one fleet, one owner, two weeks. The ratio is mine. The pattern isn't, and I'd bet it's running somewhere near you.

The agents did what I asked. I'd asked them to be reliable, and never told them what for.
