+++ 
draft = false
date = 2025-05-26T11:20:59+02:00
title = "Tradeoffs of Module Management"
description = ""
slug = "module-tradeoffs"
authors = []
tags = ["perspective", "system design"]
categories = []
externalLink = ""
series = []
+++

# Tradeoffs of Module Management

We all want reusability—until we’re in a hurry.

Or under-skilled.

Or just trying to ship something today instead of tomorrow.

Reusability takes extra thought, extra structure, and a level of patience most developers can’t afford in the moment.

So what do we do instead?
We reach for the batteries-included approach.

npm install becomes our reflex.
Install a library for everything—debounce, isEqual, date formatting.
You end up with three different utilities solving the same problem…
and use none of them.

But hey, you get battle-tested code.
Often feature-rich. Reusable.
The cost? Bloat. And often, poor fit for your exact problem.

So what’s the alternative?

## Own your dependencies.

Write exactly what you need.
Small, sharp modules tailored to your system.
Minimal by design. Reusable on your terms.

Sounds good, right?
Until it becomes your job to maintain them.

First you build. Then you reuse.
Then you realize you need to patch.

Then patch again.
Now you need tests.
Now you need a proper build pipeline.
So you move to a monorepo to keep it manageable.

Now you’re dealing with cascading changes, test orchestration, and CI complexity.
Even then—monorepos don’t save you from versioning.

If a module lives deep in your dependency tree, changing it isn’t cheap.
You either keep it backward-compatible,
or you bump the version and update every consumer.
And now you’re back in cascading effort territory.

## Here’s the central catch:

If you start owning your dependencies, they’ll often lack what you need.
You’ll patch them.
You’ll generalize them.
You’ll try to reuse them across domains—and they won’t quite fit.

That’s the moment most developers hit a wall.

Do you make it generic?
Do you fork?
Do you duplicate?
You’re back to versioning, rewrites, and the weight of ownership.

## So which path do you choose?

Install and bloat — fast, reliable, but heavy and often misaligned.

Write and own — light, tailored, but eventually expensive.

Both are valid.
And if you're building anything specific—anything real—you'll probably do both.

The key isn’t picking one.
The key is knowing where to draw the line.

As we developers love to say:

It’s an NP-hard problem.

But even NP-hard problems can be tamed—with experience.

