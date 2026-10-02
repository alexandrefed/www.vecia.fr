---
title: "Four outages, every monitor green, every check true"
description: "On one day, four unrelated systems were broken while every check on them passed. None of the checks was lying. They were all about the wrong thing."
date: 2026-10-05
author: alexandre
claim: "On 26 August 2026, four unrelated systems were broken while every check on them passed, because each check asserted something next to the outcome instead of the outcome itself."
verdict: bad
evidence:
  - label: "Infrastructure commit of 26 August 2026 naming the failure mode, listing the four outages and a fifth of the same shape, with the figures for each"
  - label: "The convention page written the same day: the check that held, what was actually happening, and the replacement assertion for each case"
models: []
tags: [agents, monitoring, reliability, operations, testing]
translationSlug: "vrai-sur-la-mauvaise-chose"
---

None of the checks was lying. That's what made 26 August 2026 so uncomfortable.

That day, three different agent sessions working on unrelated problems turned up four broken systems. Every one of them had a check. Every check was green. And every check was telling the truth.

A messaging bridge I use to reach my agents from my phone was "active": the process had been up for 16 hours. It had also delivered nothing in that time. I had been talking into silence.

The nightly backup of my self-hosted git server produced a 1.2 GB archive every night, and the archive was verified. But a quirk in the script killed it right after writing the archive and right before deleting old ones. For 36 consecutive nights. 45 archives, 51 GB, on a policy of keeping seven days.

A client's reporting workflows had documentation saying "production-ready, delivery confirmed". Their run history said 275 errors and zero successes, ever, since October 2025. Each step had been tested on its own. The assembled workflow had never once completed.

And a sync job between two of my tools had its timer enabled, its unit active, and a recent run on record. Every one of those runs had hung until it hit its 300-second timeout.

A fifth, same day, same shape, inverted: a service had crashed and restarted 23,680 times because its port was taken. Taken by a duplicate copy of itself, which was serving perfectly well. Users saw nothing wrong. The loop had been running for who knows how long.

## Why the cheap check always wins

Because it is easy to write and almost right. A running process is almost delivery. An archive on disk is almost a backup. An enabled timer is almost a job that runs. A workflow that starts is almost a workflow that succeeds.

On a normal day, each pair is identical. The gap opens only during the incident, which is exactly when you are relying on the check. So the check is green precisely when you need it to be red, and a green board doesn't just fail to help. It stops the search.

## The rule we adopted

Assert the outcome, not the process. Name the thing the system exists to produce, and check that.

| Instead of checking | Check |
|---|---|
| the service is running | it holds a live connection to whatever it serves |
| the backup archive exists | the archive lists cleanly, and the cleanup actually ran |
| the timer is enabled | the log shows a run that completed, recently |
| the workflow is active | it has a success, not merely an execution |

Two corollaries came out of the same day. Rates hide step changes: "3 failures in 144 runs" reads as tolerable, but the real sequence was one 4-second success followed by two 300-second deaths. A cliff, averaged into a slope. And absence of evidence is not evidence. A log that doesn't show a credential is often a service correctly hiding it, not proof it was missing.

## What you can do with this

Pick the three checks you trust most. For each one, write down in a sentence what the system exists to produce, then look at what the check actually reads. If the two sentences are about different things, you have found your next outage early.

Then make each check fail on purpose, once. A check nobody has watched go red is a hypothesis, not a guarantee.

The limit: four cases in one day is a pattern, not a census, and I can't tell you how many of my other green checks share the flaw. Which is rather the point. Three of the four were found only because someone was looking for something else. Not one was found by the monitoring.

The monitoring was green the whole time. Correctly, by its own definition.
