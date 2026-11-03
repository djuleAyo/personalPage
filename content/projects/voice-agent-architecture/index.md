+++
title = "Agentic Voice System"
slug = "agentic-voice-agent"
aliases = ["/projects/voice-agent-architecture/"]
date = 2026-11-03
description = "LLM voice agents that handle real calls, use business systems, and follow workflows you can test and control. Ordinary async authoring, measurable decisions, and integrated telephony."
summary = "Voice agents that handle real calls, use business systems, and carry tasks through questions and interruptions. Controlled workflows in ordinary async code, with model decisions measured against a corpus."
context = "Telephony · Controlled flows · Decision models"
weight = 2
draft = false
+++

**LLM voice agents that handle real calls, use your business systems, and follow workflows you can test and control.** Callers can ask questions, correct information, and interrupt. The system interprets their meaning, keeps accepted task state, and carries the work forward.

{{< voice-agent-nav >}}

## A call that stays on task

{{< voice-agent-call >}}

## Write the workflow with ordinary awaits

**`defineGoal` realizes a controlled state machine through ordinary async functions.** The runtime keeps a logical goal stack alongside the language's async call chain. Each registered goal invocation adds a frame: a child can handle several conversational turns while its parent waits at `await`. An accepted result lets the parent resume.

Illustrative composition; goal definitions and business schemas are omitted:

```ts
const handleCall = defineGoal(callDefinition, async (input, ctx) => {
  await greet(input.introduction, ctx);
  await introduce(input.introduction, ctx);

  if (!ctx.state.values.identity?.givenName) {
    await collectGivenName(input.collection, ctx);
  }

  await inform(input.account, ctx);
  return callEnd({ ending: "achieved" }, ctx);
});
```

**The interface uses control flow developers already know.** Calls, `if`, loops, `try`/`catch`, and returns express the workflow; goal frames add input/output validation, requirements, cancellation, and traces. Using the language's existing constructs reduces onboarding and everyday authoring friction from learning a state library's separate vocabulary. The graph visualizes goals and recorded transitions.

## Test models and control performance

**Model adapters are replaceable; the workflow stays in application code.** Goals, validation rules, and allowed transitions keep their contracts as models and decision formulations change.

- **Test the workflow:** supply known decisions and values as fixtures, then check transitions, prerequisites, and interruption handling without live inference.
- **Measure the model:** run a fixed corpus of caller evidence and expected decisions through a candidate provider, retaining failures as well as successes.
- **Control the trade-off:** compare decision quality and request latency on the same cases before changing a binding. Phase boundaries help locate whether a regression came from routing, interpretation, extraction, or generation.

{{< voice-agent-benchmark >}}

## The architecture behind the behavior

**Meaning comes before flow control.** “Why do you need my name?” calls for an explanation; “I won't give my name” calls for the declared refusal policy. Both mention the same field. Semantic interpretation establishes which behavior applies, and code controls the allowed transition.

{{< voice-agent-phases >}}

Navigation and regression can use specialised finite-choice decision models. This implementation supports a local H2O model and an OpenAI navigation binding; arbitrary extraction and new free-form replies use a generative LLM. Authored templates can be delivered directly.

Prepared turns remain provisional until accepted; cancellation preserves the suspended task. Speech delivery is tracked separately, so an interrupted message remains pending and changed facts can invalidate stale speech.

## Telephony and infrastructure

**SIP telephony connects inbound and outbound calls to the agent.** LiveKit carries the media; isolated call processes coordinate speech providers, decisions, and business services. PostgreSQL and MinIO retain history and traces, with a dashboard for live and recorded execution.

{{< voice-agent-system >}}

Docker deployments separate dev, stage, and production data while sharing telephony infrastructure. The development decision model can run behind an authenticated GPU gateway and SSH tunnel; Prometheus and Grafana provide host and container monitoring.

## RSI: trace-driven improvement

**RSI turns test calls into reviewable workflow improvements.** A larger model exercises the agent, inspects the event trace and `defineGoal` code, and opens a merge request with a fix and a reproducing regression case.

{{< voice-agent-rsi >}}
