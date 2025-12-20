+++ 
draft = false
date = 2025-12-20T11:13:48+02:00
title = "You Should Not Outsource Your Topological Sort"
description = ""
slug = "topo-sort-ownership"
authors = []
tags = ["software design", "dependency graphs", "topological sort", "incremental computation"]
categories = []
externalLink = ""
series = []
+++

# You Should Not Outsource Your Topological Sort

Things are shifting quickly in software.

Execution is no longer scarce. Parallelism is cheap. Spawning workers—human or AI—is trivial. What is no longer cheap is **coherence**: understanding what depends on what, and in which order work can safely progress.

In that world, seniority is not about knowing frameworks or tooling. It is about **owning structure**.

One structure, in particular, keeps reappearing.

---

## The invariant we keep outsourcing

Topological sort sounds boring. Dependency graphs. Build order. Module resolution.

For years, we happily outsourced this problem:
- to module loaders
- to dependency injectors
- to build systems
- to frameworks

And that was fine—when execution itself was the bottleneck.

But once you start orchestrating:
- multiple worktrees
- multiple agents
- partially overlapping tasks
- incremental pipelines

…the dependency graph stops being an implementation detail.

It becomes **the control surface**.

---

## What breaks when you don’t own it

If the dependency graph lives outside your system, you lose more than convenience:

- You can’t checkpoint progress meaningfully  
- You can’t resume work without recomputation  
- You can’t branch execution deterministically  
- You can’t define clean contract boundaries between concurrent actors  

You’re forced to “start over” more often than necessary—not because the work changed, but because **you don’t know where you are** in the graph.

This shows up everywhere:
- painful monorepo setups
- slow feedback loops
- brittle automation
- orchestration that feels magical instead of mechanical

These are not tooling problems. They are **graph ownership problems**.

---

## A concrete example: sessions as graph cursors

Imagine a single source of truth: code, data, or input.

You process it in stages:
- tokenization
- preprocessing
- parsing
- semantic analysis
- domain-specific passes

Different consumers need different depths.  
But you do *not* want to reprocess from scratch every time.

What you actually want is simple:
- recognize how far the source has been processed
- continue minimally from there
- reuse everything that is already valid

That is not a caching trick.

That is a **cursor moving through a DAG**.

Call it a session. Call it an account. The name doesn’t matter.

What matters is this:

> once you own the dependency graph, incremental progress becomes trivial.

Without it, you fake it.

---

## Why this matters more now

With AI agents, automation, and parallel execution:
- execution is abundant
- retries are cheap
- recomputation is wasteful

The limiting factor is no longer *doing work*.  
It is **placing work correctly**.

If you outsource topological reasoning, you:
- lose observability
- lose control
- lose leverage

And no amount of tooling on top can recover that.

---

## The real claim

This is not about implementing topological sort yourself for sport.

It is about this:

> **You should not outsource the authority over your dependency graph.**

Once you own it:
- session management becomes natural
- incremental computation falls out
- agent contracts become explicit
- orchestration becomes deterministic instead of heuristic

Once you don’t:
- everything becomes “best effort”
- progress becomes opaque
- automation becomes fragile

---

## Closing

Topological sort is not an algorithm problem anymore.

It is a **design boundary**.

Outsource it, and you outsource understanding.  
Own it, and higher-level abstractions finally become possible.

That choice matters more now than it ever did.
