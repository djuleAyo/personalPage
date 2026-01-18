+++
draft = false
date = 2026-01-18T17:10:43+02:00
title = "Dynamically Generated Languages vs MCP Servers"
description = "Dynamically generated languages solve the same class of problems as MCP servers—and do it better."
slug = "dynamical-languages"
authors = []
tags = ["perspective", "system design", "innovation", "MCP]
categories = []
externalLink = ""
series = ["series A"]
+++


# Dynamically Generated Languages Solve the Same Class of Problems as MCP Servers — and Do It Better

After battle-testing these ideas in practice, here is my conclusion:

**Centralized interaction and intent architectures are inevitable.**  
The only real question is whether we build them as *formal systems* or *probabilistic agents*.

---

## From Clicking and Scrolling to Invoking Capabilities

User interaction is moving away from clicking and scrolling and toward **invoking capabilities directly**, most notably via voice.

This shift is powerful:

- If you can name a capability, you can invoke it  
- Interaction becomes direct  
- UX complexity drops dramatically  

From a UX-complexity standpoint, this is a clear win.

However, this change forces a **fundamental architectural shift** compared to traditional frontend setups.

---

## React and the Problem of Distributed Capabilities

Consider a typical React application.

In React:
- Capabilities are exposed through **components**
- Components expose behavior via **props and callbacks**
- Capabilities are therefore **distributed by construction**

There is no centralized place where “what the system can do” exists.

Trying to centralize this in React quickly reveals deep friction:

- Hooks produce **unstable references** across renders  
- Central registries must constantly re-register handlers  
- Context-based solutions become brittle and stateful  
- Unsubscribing DOM listeners requires the **exact same function reference**  
- That reference is often no longer available or stable  

Yes, you *can* build a capability registry on top of React.

But it is:
- Clunky  
- Hard to reason about  
- Tightly coupled to rendering lifecycle  
- Architecturally inverted  

All of this is a strong signal:  
**centralized capability invocation does not belong inside the UI layer.**

---

## Centralization Is Not Optional

Now compare this with a system like the Visual Studio Code command palette.

VS Code exposes:
- A centralized
- Runtime-configurable
- Discoverable
- Uniform command surface

Once a command is registered:
- It does not matter where it lives  
- It does not matter which UI triggered it  
- It can be invoked uniformly  

This is not an accident.  
It is a **capability-first architecture**.

---

## The Natural Conclusion: A Decoupled Capability Layer

What naturally follows is a module that:

- Is decoupled from the frontend  
- Has no dependency on UI frameworks  
- Accepts voice or textual input  
- Emits discrete, authorized commands  

At first glance, this smells like parsing.

And that is exactly what it is — with one important caveat.

---

## This Is Parsing — Not AI

Traditional parsing assumes:
- Full input available upfront  
- A lexing phase  
- A parsing phase  
- A final AST  

User interaction does not work this way.

For voice and interactive input we need:
- Incremental parsing  
- Partial feedback  
- Real-time guidance  
- Asynchronous evaluation  

This is not AI.

**This is asynchronous parsing.**

That distinction matters.

---

## MCP Servers and the Core Problem

MCP servers attempt to solve a similar problem:
- Centralized capability invocation  
- Access via natural language  
- Location-agnostic execution  

In practice:
- Once a capability is integrated, its origin no longer matters  
- If you can name it, you can invoke it  

On the surface, this sounds ideal.

It is not.

---

## Why Informal Invocation Is Dangerous

MCP-style systems rely on:
- NLP → mapping informal language to formal side effects  
- Agents → which can and do hallucinate  

This creates a fundamental mismatch:
- **Informal input**
- **Formal consequences**

The moment real side effects exist, you must introduce:
- Authorization  
- Capability scoping  
- Denial rules  
- Auditability  

At that point, you are already rebuilding a **formal system**.

---

## Languages Are Formal Systems

Languages:
- Are minimal  
- Are precise  
- Can be syntactically close to natural language  
- Support deterministic navigation  
- Enable runtime introspection (autocomplete, discovery)  

Most importantly:

**Languages allow relational identification.**

Objects are identified not by name alone, but by their position in a capability topology.

This is strictly stronger than nominal invocation.

---

## Relational Navigation Beats Nominal Invocation

LLMs are good at resolving names.

They are bad at:
- Systematic search  
- Relational exploration  
- Topological disambiguation  

A formal language enables:
- Search through capability graphs  
- Context-aware narrowing  
- Progressive discovery  
- Authorization by construction  

This is not “autocomplete”.

This is **relational observation over a formal structure**.

---

## The Implementation Is Already Known

Asynchronous parsing is not new.

Generators:
- Exist in JavaScript for over a decade  
- Are foundational in operating systems  
- Are widely used in parsers and schedulers  

They are exactly the right abstraction:
- Incremental  
- Stateful  
- Deterministic  
- Interruptible  

Nothing exotic is required.

---

## The Critical Difference

The most important outcome of such a system is this:

**It can correctly deny you access.**

This places it in a completely different category than LLM-driven systems.

LLMs aim to be helpful.  
Formal systems aim to be correct.

When invoking real capabilities, correctness wins.

---

## Closing

Dynamically generated languages and centralized capability graphs solve the same class of problems as MCP servers.

They do so:
- Deterministically  
- Safely  
- Transparently  
- With better UX  
- And with lower long-term complexity  

This is not the future of “AI interfaces”.

This is the future of **intent architecture**.
