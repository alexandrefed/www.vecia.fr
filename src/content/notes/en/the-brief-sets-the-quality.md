---
title: "Same task, eleven runs: the model changed the bill, the brief set the quality"
description: "A precise brief came out correct on every model that finished it, at up to 4.4 times the cost. And the result everyone quoted was retracted the next day."
date: 2026-10-05
author: alexandre
claim: "On 1 September 2026, a precisely specified build task came out correct on every Claude model that finished it, while model choice moved the cost 4.4 times; the most quotable result of the test was retracted the next day."
verdict: changing
evidence:
  - label: "Bake-off protocol, committed before any run started and never edited: 11 runs, one brief per task, identical except the title"
  - label: "Results file, 1–2 September 2026: cost per run read from the billing figures the runs reported, never estimated; every finished page audited item by item; predictions written before the runs"
  - label: "The retraction, dated 2 September 2026, kept in the same file next to the claim it retires"
  - label: "Read-only review of 15 September 2026 that searched for any other small-model quality test and found none"
models: ["Claude Fable 5.1", "Claude Opus 5", "Claude Sonnet 5", "Claude Haiku 4.5"]
tags: [agents, model-routing, cost, evaluation, retraction]
translationSlug: "cest-le-brief-qui-fait-la-qualite"
---

Eleven runs, nine finished pages, and every finished page correct. Which model did the work changed the bill. It never changed the result.

On 1 September 2026 I had my agents run a bake-off. One build task, written as precisely as I could: turn one data file into one web page, with 325 items, exact headings, exact colours, nothing beyond the spec. The same brief went to Claude Haiku, to Sonnet at four effort levels, to Opus, and to Fable, Claude's top model. A second, looser brief went to four more runs. Before anything ran, I wrote down five predictions and committed them, so I couldn't quietly revise them afterwards.

## What came back

Six pages were produced on the precise task. Audited item by item afterwards (every heading, all 325 items, every link, every colour), all six were correct.

The cheapest correct page cost $0.94, on Sonnet. Opus cost $5.39 for the same page. Effort level moved the cost 2.3 times, from Sonnet's cheapest to its most expensive setting. Choice of model moved it 4.4 times, from Sonnet at low effort ($1.22) to Opus.

One result went against the price list. Fable costs about twice as much as Opus per token, yet it came in cheaper per task on both briefs ($4.62 against $5.39, then $13.74 against $17.55), because it needed fewer turns: 46 against 62, then 81 against 140. A routing rule written from the price table would have got this backwards.

Three of my five predictions were wrong. That is the reason to write them down first.

## The result we retracted

The headline that night was quotable: the small model, Haiku, produced nothing, six times out of six. Each attempt ran for 21 to 89 seconds, announced something like "Now I'll create the generator script and the page", and stopped.

Then we looked at why. In two of the six, the agent had asked permission to write a file and nobody was there to answer. In the other four, it ended its turn and waited for a user who did not exist. The runs had used a default permission mode that traps unattended agents, fixed the following day. Sonnet had hit the same wall twice on the second brief before finishing on its third try.

So on 2 September the Haiku result was retired: not confirmed, not refuted, not to be cited. The retraction sits in the same file, directly under the claim, so nobody can quote one without reading the other. We chose not to re-run it either. On a task where a $0.94 page and a $5.39 page were equally correct, one more correct page would have taught nothing.

Two weeks later I caught myself remembering the experiment as proof that with clear instructions, Haiku and Sonnet match the top model. Half of that is on record. The Haiku half was never tested: a review agent searched every document and message and found no small-model quality test anywhere. My memory had quietly promoted a retracted result into a finding. A retraction only works if it travels with the claim.

## Why every model passed

The brief dictated the heading text and five colour codes and never used the word "quality". It measured transcription, and every model transcribes. A second round gave three models an open design brief instead, and the gap opened at once: 122, 260 and 345 style rules; 10, 11 and 37 web lookups. Richness differed widely. Whether that is better design is a judgment, and it is still mine to make.

## How we route now

Two questions, before picking a model. Is judgment still open (what matters, what good looks like)? Then the strong model works on it, and its job is to write the brief, not the build. Is there a precise, self-contained brief with success criteria? Then a cheaper model executes it, and the strong model reviews once against the goal. The smallest model only gets narrow jobs whose output someone checks.

If you want to try this: write your next brief as if the cheapest model will read it, and compare cost per finished task, not per token. If you publish a comparison, put your predictions in before and your corrections next to the claim.

The limit is real. One task type, one run per cell, and a task inside every model's competence. This is a rule for routing well-specified work. It ranks briefs, not models.

The expensive part was never the model. It was knowing what to ask for.
