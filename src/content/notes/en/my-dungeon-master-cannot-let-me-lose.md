---
title: "My AI dungeon master could not let anything go wrong"
description: "Two real play records, 21 relationship changes, none negative. Nine tests of luck or skill, none failed. My AI game master was too kind to be a game."
date: 2026-10-05
author: alexandre
claim: "Across two real play records diagnosed on 13 September 2026, my AI game master produced 21 relationship changes and none negative, 9 tests and none failed, and never let a deadline fire."
verdict: bad
evidence:
  - label: "Four read-only agent diagnoses, 13 September 2026, over two real play records, all 208 story cards and the game master's prompt pipeline; the summary counts are recorded in the project's state file, the full reports were not kept"
  - label: "Measurement of what the game master receives against what was written: 207 of 208 cards cut, 317,913 characters lost to one cap"
  - label: "Agent playtest of 26 September 2026: 20 turns on a copy of the live campaign, 7 gated checks"
models: ["Claude Sonnet 5"]
tags: [agents, llm, games, sycophancy, game-design]
translationSlug: "mon-mj-ne-peut-pas-me-laisser-perdre"
---

21 relationship changes between my character and the people around him. Not one went the wrong way.

Nine times the story put him to a test. He passed all nine. And no deadline, in any session, ever arrived.

That's what four agents found on 13 September 2026, reading two real play records of the solo survival game I play against an AI game master. Their verdict, in one line: nothing can go wrong for the player. Which is a strange thing to say about a post-apocalypse.

I had noticed something was off. The game felt pleasant. Survival games are not supposed to feel pleasant.

## Three causes, stacked

The first is the model. Language models are trained to be helpful and agreeable, and that serves almost every job you give them. A game master is the exception, because there the friction is the product: the NPC who stays angry, the plan that fails, the deadline that lands. That part is my reading, not a measurement, but the counts above are what it looks like.

The second cause was us. The written contract for the game master asked it to end each block on atmosphere, and it did: 65 of 87 blocks ended that way, exactly as asked. The world described itself beautifully, and reacted to me, but it never acted on its own.

The third cause was the one nobody had measured. The game master only received about 13% of what had been written for it. One cut, at 200 characters per story card, bit 207 of the 208 cards and removed 317,913 characters, and a fixed list of fields dropped another 95,297 on top. The villains' plans, the clocks, the things that were supposed to go wrong: most of that lived in the 87% it never saw. It couldn't be harsh with material it didn't have. And the engine meant to move the world forward was wired in and fed no data at all.

## What changed

The decisions, taken the same day. Consequences come from clocks and threats that advance on their own, not from dice. Risk scales with support: a player with allies and preparation rarely meets catastrophe, a player alone and reckless genuinely can. When something does go badly, the game explains what happened afterwards, instead of warning in advance and softening the blow. The 200-character cut was condemned on the spot, and the full cards reached the game two days later.

On 22 September the rewritten world went live: 244 story cards, 16 independent threats, 8 clocks and 3 pursuers who come back. All of it things the game master could not see before.

## The honest limit

I don't know yet whether the game has teeth. A 20-turn agent playtest on 26 September never left the first morning, every clock in the campaign is counted in days, and the earliest one falls due on day one. So no clock could have moved, and none did. The only test that settles it is me, playing.

## What you can do with this

If you use a model as a game master, a tutor, a sparring partner or a coach, count the negatives. How many times did it tell you no, mark you wrong, or let something cost you? If that number is zero over a real sample, the model isn't being fair. It's being nice.

Then put the consequence in code, not in the prompt: a counter that advances whether or not the model feels like it. Asking a people-pleaser to be tough is a prompt. A clock is a rule.

A game you can't lose isn't generous. It's a screensaver.
