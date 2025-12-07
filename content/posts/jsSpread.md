+++
draft = false
date = 2025-05-15T17:10:43+02:00
title = "JS spread performance ⚠️warning"
description = "Maybe you know the spread can be costly. Maybe you don't. Maybe an example will solidify your knowledge."
slug = "spread-performance"
authors = []
tags = ["JS", "opts"]
categories = []
externalLink = ""
series = []
+++

# JS spread performance ⚠️warning

Us web devs, we often speculate syntax based on "best practices" bestowed upon
us by the Gods of - meme lords. We praise our prettier and linters as basis of
all success. Looping between all 22 and a half options of a drop down
allows you to use exponential complexity implementations. In a loop.
Because even if you have 2k entries thats a warmup for one core.
So in all wire connections between types, runtime validators, component props,
api responses and requests, rarely in fact implementation matters from performance standpoint. Except when it does.

> Spread operator can cost you performance

Straight to the point. **Never use it in a loop**

```js
const buf = {}

Object.keys(incomingData).forEach((entry) => {
  buf[entry] = {
    ...buf[entry],
    ...incomingData[entry],
  }
})
```

I did this recently because of **"immutable is good"** hype. And quickly found
out it has its costs, especially in this given form.
Each assignment there is linear complexity to object size. Meaning doing that in
loop is **O(n^2)**. And if you have 2k entries, well, no need to imagine.

Recently I did clean finger thick dust cover from my profiler start button
so isn't that a change. Instead of speculating syntax we can actually measure

Results?
Parsing 2k lines of custom simple language yielded 2 drastically different results.

* the spread in loop way went over **63 seconds**
* changing just one expression from spread to property assignment yielded **0.5 seconds** for the same 2k lines!!!

One line of code. One expression and 62/0.5 = **`124x times faster`**!!!
Be my guest, that kind of difference becomes notable even on few tens of entries!

So, yeah immer is cool, and your store wants a new reference to dispatch the changes, but that doesn't mean you should change it n times in a loop.
As you can see. Instead keep using regular assignment and change the reference
only once when needed.

```js
const buf = {}
Object.keys(incomingData).forEach((entry) => {
  buf[entry] = incomingData[entry]
})
```

Old school 👊

In conclusion, spread in a loop is almost as evil as awaiting in a loop
