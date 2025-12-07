+++ 
draft = false
date = 2025-05-17T09:22:50+02:00
title = "The missing development metric - UX complexity"
description = "UX complexity is the missing development metric. It is the cost of interaction and arguably the most important metric."
slug = ""
authors = []
tags = ["perspective", "system design", "innovation"]
categories = []
externalLink = ""
series = []
+++

# The missing development metric - UX complexity

While everyone, ok not every one is talking about computational complexity. Especially in high level languages with accent to functional programming.Recomputation is the name of the game. So even on that
old topic a lot could be said. But **UX complexity** - the cost of interaction
as arguably the most important metric and its not yet a termed metric.
Let's face it, if you nailed UX complexity, you nailed computational complexity long ago.

## Innovation in UX is educational process

Yes we hear designers bragging about one click less UX experience. Yet they use standardized component libraries and expected UX patterns. Not much to invent, a lot to be careful about! It’s almost like innovative design is discouraged. And if you ever payed attention how people of age of higher number use their devices 
you start to realize educating people on UX principles is driven, multiple decades long education process. First they were inspired by the idea of free
of cost calls, now they play candy crush 🍌.

## Current state of UX

But if we step back even more, and see the UX of entire systems then clarity comes so easily. We do this to dig out problems and pain point I want to talk about. UX is
* fragmented
* locking

Fragmented as UX is resembling more a corporate structure than intent of the user. Instead of sending a message being designed around UX of sending a message. It is designed around who owns the platform and what is the business model. There is nothing UX focused about that. Its all encompassing fragmentation of the system called "app store".

Current architecture is **paas** like. You have provider of platform - infrastructure (master). Then you have app fragmentation not caring a slightest bit about the user and intent. Then you have locking experiences in form
of feeds, scrolls, hooks, notification pings and so on.

### O(n) UX

Now scrolling is **o(n)** experience of UX where user is compelled to scroll like that pigeon with that button. 🔘🐦 And sadly, we all know how quickly
time is traded in that trans like state. o(n) experience is unacceptable in any
other areas as well. We all scrolled a gallery and after scrolling few hundred
photos overscrolled past the photo like overlooking a food pot in fridge pointed by spouse. In one word, one emoji, trash 🗑️

### O(log n) UX

Menus are **o(log n)** and I must compel you they too are not good enough.
They are obviously miles ahead of scrolling, but lets see how avoiding them
will make your life easier.
When I think menus I think - specialized software. Gimp, blender, and alike.
Those kind of softwares still require specialized professional. Is that not
all the proof we need? I mean, I can edit a photo but its like an elephant
in glass store. To work effectively in that kind of software one must develop
muscle memory. Productive work needs muscle memory. And this is more important
then you think. There is subconscious aversion if time to express your self
and time to think of what you want to express have too wide gap.
Most accessible example is browsing on a slow connection. After 5 minutes you just
don't want to do it. Its the exact same story when im trying to edit a photo.
If i could just access the function (blur the damn photo)without clicking through menus and knowing particular specifics of the software,
and developing muscle memory for all that, I too could edit a photo. Because in the end I know the result, I know what arguments to achieve it.
The only thing preventing me is the UX. It might be seen as a skill issue, but it is not. It is a UX issue.

Another example is scrolling through a file tree if you are a coder.
Here I proclaim. 

> Never scroll through a file tree. It makes you a coding monkey

Disable that part of the IDE. It is a bad habit. A waste of time.
You have so many more ways to access a location then scrolling through a file tree. It is disastrous degradation of log complexity into linear.
And it is never worth scrolling and always better using something else.
But on this topic I will write a separate log.


### O(1) UX - the dream

So lets conclude this log entry by simply staying with the dream a while longer.

> We want to be able to command the system in any reach of our comprehension

Now this is a dream envisioned in the movies and that iris episode of black mirror. AI chats kind of know what you want and they do provide wide range of
solutions. We see more and more chat driven interfaces. But even that... response waits aint fun.

So **o(1)** user experience complexity. I just think and the system knows what I want. What ever I want to refer to I can in constant time of user expression.

Search engines kind of do this but you know:

* marketing
* third party interests
* ...

If you don't know what you are searching for, either by name or by link, you are screwed. Something is missing. Stick around for some of the next logs where I will explore this dream further.