+++
draft = false
date = 2025-05-15T17:10:43+02:00
title = "FP vs IP and Microservices vs Monoliths are the same argument"
description = "Through two highly hyped clashes of modern development—functional vs imperative programming and microservices vs monoliths—we share insights and offer perspective."
slug = "recomputing-since-christ"
authors = []
tags = ["perspective", "system design"]
categories = []
externalLink = ""
series = ["series A"]
+++

# FP vs IP and Microservices vs Monoliths are the same argument

There is a huge parallel between:

- functional vs imperative programming  
- microservices vs monoliths

Now, the most unwelcome thing—dogma—should have no foothold in the software world. But it does.  
Just like other markets, we ride waves of virality. It’s no coincidence that most beginners choose the most popular frameworks and languages.

While this kind of marketing gives guidance, it destroys the very essence of what coding should be: **sense**.  
So parrots fly around and repeat things like:

- "Microservices are better than monoliths"  
- "Functional programming is better than imperative programming"

But both approaches live, both are used—and that alone tells us both are good and both have their place.

Let’s draw the parallel between these two debates and expose the hype for what it is.

---

## The Microservice Hype

Every aspiring developer is told they must know how to build scalable systems before they can land a job—as if each of us is building cloud-scale infrastructure for side projects.

Buzzwords in job postings feed the hype, and so do slogans like:

- “Your microservice team can be fed by one pizza.”
- “Keep your services stateless.”

How many times have I heard the second one in interviews—only to open the source code and find a constructor call inside a `get` method, of a class passed via dependency injection... in JavaScript.

Come on. Time to quit (this really happened 😅).

---

## Java Overengineering in JavaScript

Java-style overengineering doesn’t belong in JavaScript.

- Your JS module is automatically a singleton (unless you use dynamic imports).
- The runtime handles circular dependency resolution.
- Your module’s global-scope variables can’t be mutated from the outside without you **exposing** an interface to do so.

And yet, people bring Java complexity patterns into JS like it's a rite of passage.

---

## Bitter sweet reality

This brings us to the real point: most devs are beginners. This will always be true.
Most of us are territorial (we defend our code even when it sucks), and many are driven by the desire to be **right**—or at least to appear smart.

This, combined with a general lack of experience, makes it almost a rule: **large codebases will be colored with smells**.

Even "stateless" microservices often use stateful libraries or sessions for auth. Perspective is lacking—and that lack is guarded by dogma, which ultimately reduces to social behavior.

And maybe that’s fine.  
After all, every problem should’ve been solved yesterday. Business doesn’t wait. We must deliver. Fast.

So there’s no time for:

> *"If you want to make pasta from scratch, you must first invent the universe."*  
> — Carl Sagan

---

## Services Should Be Focused

Like modules, services should focus on **one thing** and do it well.

Why? So we can scale them horizontally, reuse them, and maintain them independently.

But here’s where inexperience hits.  
Many devs—even seniors in web—have never written a proper multithreaded program. Those who have know that **orchestrating multiple clones of the same thing requires overhead**.

In microservices, this overhead is primarily the **cost of statelessness**.

---

## Stateless by Design — and by Cost

Your message queues, Redis instances, and storage layers all need to be stateless (or used in a stateless way), because **synchronizing across clones** goes against horizontal scaling.

Need more performance? Spin up more instances.

The more instances you have, the harder it gets to synchronize them.  
So… just don’t.

- Don’t cache.
- Don’t store session data.
- Don’t share memory.

Instead: **recompute everything** every time.

Just like how a server-side page is re-rendered per request.

---

## Example

Let’s put it in beginner-friendly terms.

Say you have a function:

```python
def fibonacci(n):
```

Now you call:

```python
print(fibonacci(100))
print(fibonacci(101))
```

Neither functional programming nor microservices care that you just computed fibonacci(100).
On line two, you start from scratch.

Only difference? A microservice wraps it in an HTTP request.

So the real question becomes:

Why is this better than a monolith?
Why is it better than imperative code that could just cache the result—scaling vertically and holding runtime state with ease?

> “Devs can think much further than they can code. Power to express oneself is lacking.”

This is the key.

Recomputing is obviously more expensive than caching, from the machine’s perspective. But from the developer’s perspective?

Caching is low-level. Tedious. Demanding. Often lacking expressive power.
So we avoid it.

Instead, we build massive CI pipelines, spin nuclear-scale infrastructure, and recompute everything since Christ—just to avoid managing memory.

## Scaling with Clones vs Standing on State

Functional programming and microservices recompute anew—but can easily spawn 1000 instances of the same thing.

Imperative programming and monoliths tend to revolve around a single instance—but with the benefit of retained state and optimized memory usage.

Which one is better?

No straight answer.

## Protecting the Codebase from Your Own Team

If you have a large team, you often want to restrict expressive power.

You narrow responsibilities so each dev works in isolation.
This reduces risk, reduces damage, and speeds up onboarding.

Yes, expressive power is linked to production cost and complexity.
And industry cares more about delivering features than squeezing performance.

Under one condition:

## Platforms vs Applications

We can divide software into two rough categories:

* Infrastructure — platforms like compilers, browsers, frameworks, and libraries
* Applications — business logic and user-facing systems

If you fall into the second category, you tend to value:

Expressive power

Fast iteration

High-level abstraction

That’s when you lean on frameworks, CI pipelines, and horizontal scaling.

But if you're building infrastructure, you care more about:

Precision

Performance

Long-term stability

So you optimize. You profile. You write tight, efficient code.

## The Pendulum Swings

We can’t always compute exactly when it’s time to switch paradigms.
When is it worth optimizing that slow service? When is it better to lean into scale?

The pendulum will keep swinging—from monolith to microservice, from FP to imperative.

But the ideal gap between what we can think and what we can express in code is still wide. Maybe unbridgeable.

## The Real Limitation: Human Abstraction

It’s not that we lack tools to build expressive languages. They exist.
The real problem is:

Human limitations in abstraction.

As one of my respected colleagues once said:

“The more abstract you go, the more language resembles static noise.”

And that is something worth pondering.

It may be the real cause behind these never-ending clashes in modern software:
FP vs IP, MS vs monolith — and the limits of the human mind behind the keyboard.
