+++ 
draft = false
date = 2025-09-14T09:22:50+02:00
title = "Why You Must Revisit the Stack Data Structure in the Age of AI"
description = "With the rise of AI-assisted coding, execution has become cheap. You can let the AI do the wiring. What you cannot delegate is the choice of abstractions. And that changes everything."
slug = "stack-importance"
authors = []
tags = ["perspective", "system design"]
categories = []
externalLink = ""
series = []
+++

# Why You Must Revisit the Stack Data Structure in the Age of AI

With the rise of AI-assisted coding, execution has become cheap.

You can let the AI do the wiring.  
What you **cannot** delegate is the choice of abstractions.

And that changes everything.

If *you* choose the right abstractions, your system scales.  
If you don’t, you don’t get “bad code” — you get **semantic debt**:  
a pile of spaghetti whose behavior you no longer understand.

That’s why data structures matter more today than they did before.
Not because you must be able to *implement* them,
but because you must understand the **semantic consequences** of choosing one.

Those consequences often cascade far beyond what you intended.

Let’s see this with the simplest example possible.

---

## The Stack Is Not Just a Stack

A stack is one of the simplest data structures we have.
So simple, in fact, that it exists physically in hardware.

- CPUs implement stack pointers  
- Operating systems allocate a stack per process  
- Languages expose it implicitly via function calls and scopes  

In C-like languages, opening a `{}` opens a stack frame.
When you exceed stack memory, the OS kills your program.
Even *Stack Overflow* is named after this exact failure mode.

You **cannot** write a program without a stack.

So far, nothing surprising.

But now track execution *mentally*.

If function `A` calls `B`, and then `C`, execution looks like this:

- Enter `A`  
- Enter `B`  
- Exit `B`  
- Enter `C`  
- Exit `C`  
- Exit `A`  

At runtime, the stack is a **path**.

But over time, the trace of execution forms a **tree**:

- `A` is the parent  
- `B` and `C` are siblings  

The stack is not “just LIFO”.
It is a traversal of a tree-shaped execution history.

This matters more than most developers realize.

---

## Execution Leaves a Shape

Most developers are comfortable with stack behavior.  
Far fewer are comfortable with **closures** — and this is why.

Closures break the illusion that execution is only a stack.

Consider this example:

```ts
const makeClosure = () => {
  let a = 10;
  function closure() {
    console.log(a);
  }
  return closure;
};

const myClosure = makeClosure();
myClosure(); // prints 10

```

Here’s the puzzle:

* makeClosure() creates a stack frame
* That stack frame exits
* Yet a is still accessible later

So where is `a`?

It cannot be on the stack.
The stack frame is gone.

The only possible conclusion:

**execution is no longer a simple stack.**

What actually happens is this:

* The stack is one branch of a larger execution tree
* Closures preserve parts of that tree after the branch collapses
* Variables escape time, not scope

Once you understand this, async functions, promises, callbacks,
and event-driven runtimes stop feeling magical.

They are not “stack tricks”.
They are graph-shaped execution.

## Why You Should Care

In an age where any of us can spin up a workforce in the form of AI agents,
the real challenge is no longer writing code — it’s **scaling systems**.

People sense this intuitively.
That’s why they keep building frameworks, layers, and tooling
with increasing internal complexity.

Frameworks consume your code — or AI-generated wiring —
and impose their own abstractions and limitations.
That is precisely where architectural decisions become irreversible.

Here’s the key point:

Seeing the stack as the **active trunk of an execution tree**
is the mental model behind virtual machines,
language runtimes,
and frameworks themselves.

If you don’t understand the semantic consequences of your data structures,
you are outsourcing architecture to tools
that don’t pay the cost when things go wrong.

I’ll write more about this using concrete examples
from a VM I built using exactly this perspective.
As a preview: it supports async pipelines natively —
but more on that later.