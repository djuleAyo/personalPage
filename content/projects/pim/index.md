+++
title = "PIM: Voice & Agent Control"
date = 2026-11-03
description = "Control applications through voice, AI proposals, and scripts using one shared command model. Explicit actions, nested interaction contexts, and behavior you can inspect and replay."
summary = "One command model for voice, scripts, and AI proposals. Resolve instructions to explicit application actions, keep interaction context, and inspect or replay what happened."
context = "Voice & agent control · Explicit actions · Trace & replay"
weight = 4
draft = false
+++

**Control applications through voice, AI proposals, and scripts using one shared command model.** PIM resolves incoming words to declared application callbacks and records how each command was handled. The model supports context, arguments, and command completion, with behavior you can inspect and replay.

{{< pim-demo >}}

## From a proposal to an explicit action

**A command has to resolve through the declared interaction model to reach a callback.** The bundled proof makes this concrete with fixed proposals and recording adapters:

{{< pim-proof >}}

The application still owns its effects and permission checks. PIM makes command resolution and dispatch explicit, so a reviewer can inspect the route from input to callback.

## One interaction model across input channels

**Commands live in the interaction model; input and effects connect through adapters.** A speech recognizer, model, or script supplies words. PIM resolves them in the current interaction context, and application callbacks implement the resulting actions.

{{< pim-boundary >}}

Nested interaction spaces keep commands in context. The runtime can return unused words to a parent interaction, find a valid command in an enclosing context, and expose the options available next. A `$stop` marker distinguishes a completed phrase from a longer command with the same prefix.

This lets an application reuse command semantics across entry points. The host supplies speech recognition, model inference, UI integration, and effectful services.

## Declare the action, observe the execution

A minimal command model with a recording callback; imports are omitted:

```ts
const actions: string[] = [];
const trace: ProcessingEvent[] = [];

const interpreter = runtime({
  deploy: {
    preview: {
      onUtter: () => actions.push("deploy-preview"),
    },
  },
}, {
  onProcessingEvent: event => trace.push(event),
});

interpreter.next();
interpreter.next(["deploy", "preview"]);
// actions: ["deploy-preview"]
```

The declaration connects a resolved path to an ordinary application callback. Observers receive processing events separately from the callback, including matched options, path changes, queued actions, continuations, and rejections.

## Test behavior without calling a model

**Fix the inputs and inspect the exact actions.** Tests can supply words, runtime state, and recording callbacks directly, then check the resolved path, arguments, and processing trace. A failure can be investigated from the intermediate events as well as its final effect.

With the same interaction model, state, normalized words, and callback results, PIM reproduces its resolution and event sequence. The bundled proof evaluates the complete proposal batch twice and compares decisions, actions, and trace summaries byte for byte. Inference and external services remain outside that deterministic boundary.

The public repository is a **standalone, tested runtime preview**. Explore the [source and executable proof](https://github.com/djuleAyo/pim-bundle), the [architecture](https://github.com/djuleAyo/pim-bundle/blob/main/docs/ARCHITECTURE.md), or the [original demo post](https://lnkd.in/p/dxVwGSbb).
