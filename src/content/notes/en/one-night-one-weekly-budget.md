---
title: "How one night of helper agents ate a week of AI budget"
description: "Helper agents launched without a model name silently inherited the top model. The weekly allowance was gone on day two."
date: 2026-10-05
author: alexandre
claim: "On the night of 14 to 15 September 2026, helper agents launched without a model name inherited the top model from their parent and burned most of a weekly allowance in about five hours."
verdict: bad
evidence:
  - label: "Read-only investigation of 15 September 2026, with token counts re-measured from every local session transcript between the weekly reset and 08:00 the next morning"
  - label: "Record of the same failure on the unattended-agent queue, 28 to 31 August 2026: session count, token total and the uncommitted work lost when the limit hit"
  - label: "The fix as it stands: the default-model setting and the pre-launch hook, both dated 15 September 2026"
models: ["Claude Fable 5.1", "Claude Opus 5", "Claude Sonnet 5"]
tags: [agents, subagents, cost, claude-code, defaults]
translationSlug: "une-nuit-un-budget"
---

My weekly usage limit reset on Monday 14 September 2026 at 22:00. By Tuesday morning, the allowance for the top model was at 100% and the overall weekly limit at about 70%. Day two of seven.

Nobody had decided to spend it. That turned out to be the problem.

## What happened

Re-measured afterwards from every session transcript on my laptop: 3.34 million output tokens on the top model between the reset and 08:00, almost all of them between 22:00 and 03:00.

87% of that (2.90 million) came from one side project. Earlier in the evening I had put its main session on the top model for a diagnosis, which is a reasonable use of it. The session then moved on to building and launched about two dozen helper agents to do the work. None of those launches named a model. Between them, the helpers ran 3,318 turns and produced 2.43 million tokens on the most expensive model available, mostly writing and checking files that a cheaper model handles fine.

## Why

In Claude Code, a helper agent launched without a model inherits its parent's. It's a defensible default: you don't want quality quietly downgraded behind your back. But it means the cost of every helper is set by whatever the parent happens to be running. Put the parent on the top model for one good reason, and every helper it spawns afterwards is on the top model for no reason.

The project even had a written rule: helper agents that write content run "on the session model". The rule was followed to the letter. Nobody had written down what happens when the session model is the most expensive one.

## The part that stings

It had already happened. From 28 to 31 August, on the queue that runs my unattended agents on another machine: 135 sessions, 1.4 billion tokens, 100% of them on Opus, because the launcher passed no model and every agent took the default. The weekly wall hit at 00:31 and six tasks died mid-edit, with 3,314 lines of work uncommitted.

We fixed that. For that launcher. The interactive sessions on my laptop, which spawn helpers through a different path, were left exactly as they were. Same hole, one door over, two weeks later.

## What changed

Two things, the same day. First, a default for helpers that don't name a model. Claude Code reads it from an environment variable (`CLAUDE_CODE_SUBAGENT_MODEL`), and ours is now Sonnet. It was set to Opus at first and corrected a few hours later, because Opus was also running short that week.

Second, a hook that runs before every agent launch and refuses the inheritance case outright: no model named, parent on the top model, launch refused. The top model can still be used for a helper, with a written reason, one at a time, and every such launch is logged so it can be reviewed later.

The remaining eighth of that night's spend came from agents someone had deliberately put on the top model, several in parallel. A different mistake, about width rather than inheritance, and the hook now caps that too.

## What you can do today

Search your setup for every place that launches a helper agent, and check which ones name a model. The ones that don't will inherit, and you should know from what.

Then set the default variable. It's one line in your settings, and it turns "whatever the parent was" into a choice you made once, on purpose.

And when you fix a cost leak, list every path that spawns agents before you call it fixed. We fixed one and left the other open.

The honest limit: the hook stops the inheritance, and the log exists. I don't yet have a review showing how much it saves. That's the next measurement, and I'd rather say so than guess.

A default is a decision. Ours had been made by nobody.
