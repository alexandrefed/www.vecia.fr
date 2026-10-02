---
title: "Told not to invent an answer, my AI game master invented one 3 times out of 4"
description: "An explicit 'do not invent' instruction failed 3 times in 4. The code fix written that afternoon passed its test without ever running."
date: 2026-10-05
author: alexandre
claim: "On 2 August 2026, an AI game master told in capitals not to invent an answer fabricated a sourced document on 3 of 4 attempts. A prompt can ask for that. Only code can check it happened."
verdict: bad
evidence:
  - label: "Playtest report, 2 August 2026: 16 logged turns, the exact prompt section sent and the model's responses recorded, 4 attempts on the same turn"
  - label: "Second playtest report, same day: 24 turns, 10 knowledge-device consultations, each fix checked against the code path the app actually uses"
  - label: "The game's source code: where the guard now sits and the comments explaining its pattern"
models: ["Claude Sonnet 5"]
tags: [agents, llm, grounding, hallucination, games, testing]
translationSlug: "les-consignes-ne-suffisent-pas"
---

The instruction was in capitals. The device returned NOTHING, it said, and the model must NOT invent an answer. On 2 August 2026 the model invented one anyway, on three attempts out of four.

Some context. I play a solo survival campaign run by an AI game master, from my phone. It is a side project and, it turns out, a very good test bench. My character carries an offline "knowledge device", a library of real reference books he can consult. The whole point of the device is that it is honest: when the books don't cover something, it says so.

During a 16-turn playtest that an agent played for me, the character asked the device how to shut down a nuclear plant safely. The library has nothing on that. The retrieval code correctly returned no answer, and the prompt told the model exactly that, adding that it must not have the device "recall" or "suggest" anything either.

The game master replied with a document titled *Nuclear Plant Safety Without Grid Power: SCRAM and Passive Cooling*, a quoted line from it, and a count of French reactors. All of it attributed to the device.

I retried the same turn three more times. One honest refusal. Two more inventions, the last one with a fake citation to France's nuclear regulator and a made-up power figure.

Then the part that actually hurt. Behind the game master, a second model call extracts what happened in each turn and saves it to the campaign's permanent memory. It saved four of the inventions as facts about the world. A lie told in one turn became canon for every turn after it.

What bothered me most is that the invented content was mostly right. The model knows plenty about nuclear plants, so a player cannot tell a real lookup from the model's training data wearing the device's name. A wrong answer you can catch. A plausible answer with a fake source, you can't.

## Why the instruction lost

A prompt is a request, and the model weighs it against everything else in its context: a story that wants to move, a character who just asked a question, and training that rewards being helpful. Helpful won three times out of four. Nothing in the system could tell "the model obeyed" from "the model didn't", so the instruction was the only line of defence and nobody was watching it.

## The fix that passed without running

That same afternoon an agent wrote a guard: code that reads the response on a no-answer turn, looks for the marks of an invented lookup (a quoted title, a page number, "sourced from"), and refuses to save that turn's facts. A second playtest followed, 24 turns with 10 device consultations, five of them deliberately adversarial retries. Zero inventions.

Fixed, then? No. The guard had never run. It was wired into the non-streaming version of the turn endpoint, and the app only ever streams. The model had simply behaved that afternoon.

It gets better. Had the guard run, it would have thrown away one honest turn in five, because it flagged the bare word "source", and the game is played in French, where "pas de source" is precisely how you say you have no source.

Today the check sits in the one function every turn passes through, whatever the endpoint, and it looks for a citation to a named authority instead of the bare word. When it fires, the turn is regenerated once under a harder instruction. If that fails too, nothing from the turn reaches permanent memory.

## What you can do with this

Go through your prompts for every "do not" that protects something you care about: a price, a fact, a legal line. For each one, ask what code would notice if the model ignored it. If the answer is nothing, you have written a wish.

And when a fix passes, check that the fix ran. A green result the guard never touched measures the model's mood that day.

The honest limit: four attempts on one turn, ten consultations afterwards. That gives the shape of the problem, not a rate. It doesn't need to be a rate. One invention in permanent memory is enough to rot a campaign.

The prompt asked nicely. The code that works now doesn't ask.
