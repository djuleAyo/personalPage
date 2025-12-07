+++ 
draft = false
date = 2025-05-31T14:31:18+02:00
title = "Language agnostic steno theory"
description = ""
slug = "lang-agnostic-steno"
authors = []
tags = ["steno", "hmi", "innovation"]
categories = []
externalLink = ""
series = []
+++


What a glorious weekend. What a joy. 
In two days I implemented

> language agnostic steno theory

There is code at the bottom but lets focus on the theory first.

## My take on why steno is appealing

200 wpm non invasive hmi.
Full words: 200 words per minute without a chip and usb port in your head
interface for commanding a machine.  Basically thought speed interface.
Appealing. As short as that!
A chip in your heard has r/w and idea of w in my head already creeps me out
even without a chip so no thank you. So demanding muscle memory training it is.

## Theory is? Why existing suck

There are multiple theories. And learning them is a pain. Theory is basically how you map chords to words.

* steno is optimized for english
* they take years to learn
* That effort is wasted if it can’t generalize to other languages. (now it can, so those of you who wanted this, welcome home)

So learning it and having results in just one language is disaster.

And as if language agnostic steno theory is not enough to hype,
this theory is so much superior in theory metrix compared to existing
its simply a question why it wasn't like this from the beginning.

But step by step. Let's first see what are characteristics of a theory

## Theory characteristics

* is it free of cost
* chords per word metric
* consistency
* memorization

Since there are billions of chords you need a system.
Now the more you stay inside single system the more is consistent and easier to
remember but staying in a system without exceptions leads to suboptimal solutions
from time to time. So a theory trades consistency for less chords per word
and with that requires more memorization.

And showing this in practice existing theories exactly manifest these tradeoffs.

And still whatever you choose you'll need to memorize thousands (literally) of
entries, besides muscle memory, to be effective.

> Before completing this read you will learn entire new theory with
better chord per word frequency then existing theories and with perfect consistency

## Requirements

Sounds too good to be true, as as it is often a case with things that sound too
good, there is a catch. So what is it? Let's not postpone the hit.
You must know IPA - international phonetic alphabet. Not all of it
30 bloody letters covers most languages with almost 1 to 1 correspondence.
Thats it.  And some hardware requirements. Nothing else.

Now I'm going to be offensive, and intentionally so.
Non phonetic writing languages 
* french
* english
* etc

This writing is broken. Yes it shows the history of word and its origin 
from a different language, ok, but writing should be defined and correlated to,
well reading my dear friends. If this idea alone is too much for your molded
brain to grasp get out of my sight. Now I get it, English is kind of dominant
and dominance doesn't play nice. It is the one saying my way or the high way.
But with trade off as this one? Again:

Language agnostic maximally consistent, fastest theory

you can forgo your stupid writing ways. I hope so
And still, even existing theories go into IPA, so nothing new, just go all the way
for that language agnostic truth.

And Germans, Russians, sanskrit indian languages and clearly pure glory of south slav
language aligned with IPA 100% will be at home with almost no gap.


## New theory - Design

### Existing hardware analysis

When I started investigating steno, 200 wpm hmi glowed in intersection of
my subconscious and conscious mind as Sun itself. But me being European,
speaking 3 natural languages and many formal ones, fact of such gigantic effort
being useless in ANY area of my machine interaction was out of question.

So I didn't learn any existing theory. I invented new one. What I did 1st?
Investigated existing hardware. Last decade was kind of giving in sense of 
ergonomic programmable keyboards opening entire new market to gracefully sink money overflows of coding monkeys. And it was devastating likewise, because bloody
piece of plastic and "whatever switch" shouldn't be $500. Where the f is this world going.
Anyhow... Diversity of hardware is nice, and i do enjoy it for long array of years now.
I will cover truth of keyboard ergonomics on its own, but for now lets just say
the core principle of ergonomics that defines the input hardware itself.

### Ergonomics

Independence of movement. So those so called 3d switches can move any direction
but if you spend some time watching your hand move you will notice there is no 
total independence of movement between fingers. To keep things short
your index, thumb and pinky can move independently, both x and y axis meaning
you can cover 4 buttons with each, but middle and ring finger are not independent
on x axis only on y axis. Its simply hard to extend index and pinky and contract 
middle and ring at the same time.

So to sum up, 4 bits for 3 fingers and 2 bits for 2 fingers.
Ah yes, thumb explanation. Thumb clusters are example of overpriced engineering shame.
Stamp it as ergonomic and set that high price, meanwhile it takes a decade 
for manufacturers to figure out what a good thumb cluster is. Just as i said it.
Shame. Anyhow that radial thumb cluster is good, and it should have 3 or 4 buttons.
As easy as that.  Since we need bits give us 4 please. Thank you.

![](https://www.zsa.io/cdn-cgi/image/width=769,quality=80,format=auto/@moonlander/images/legacy/22-blink-beep-0.webp)

Moonlander thumb cluster - approved ✅ Assuming button marked as arrow right is pressed with thumb also and far right  button is far and ignored.

![](https://cdn.shopify.com/s/files/1/0374/9448/9228/files/dygma-defy-showcase-compress.jpg?v=1678183523)
While defy is not optimal to hit those 8 buttons individually with thumb, pairs are wonderful. approved ✅

![](https://kyrremann.no/keebs/assets/images/elephant42.png)

Even something cheaper like this "elephant" baby works well. approved ✅

In some of following posts I will explain why you may need more then 42 buttons so it may lack in that regard, but thats another story.

Now lets proceed. So far we have 16 bits for one hand.
pinky 4 and ring 2, thats 6
Now wait a minute. Can you press diagonals with pinky, or 3 button combinations?
Maybe, but we will not use those. So this reduces our bandwidth.
Pinky has 8 realistic positions, 4 independent buttons, 2 verticals and 2 horizontals


### Result

8 * 4 = 32 positions for 2 fingers. We can map all letters there! IPA letters
not trash joker letters like y. Sometimes reads this way, other times other way.
Spare me.

So here, example mapping. Straight into the gold mine:
```
` :     `:    , :     ,:       t    k    d     c    // : means ring finger does nothing
` `     ``    , `     ,`       v    b    f     p 
` ,     `,    , ,     ,,       r    m    n     s
` |     `|    , |     ,|       l    k    dz    z   // | means vertical pressed

--:    __:    | :     |:       j    ch   dj    cj
--`    __`    | `     |`       a    e    i     o
--,    __,    | ,     |,       h    sh   nj    sj
--|    __|    | |     ||       u   zh   lj    
```

There is a thing of building new letters by attaching j (ipa j) or h on them.

english:

* c + h,
* z + h (like french jolie)
* s + h (ie show)
* n + j (new)

non english examples: 
d + j, t + j, l + j, s + j 


This concrete mapping is kind of easy to remember as it takes into account
how letters are built by appending j or h, so s + h  is same bits as s and vertical
above, and similar for others. Modified letter is adjacent to the original

Also, vowels are dense, often requiring 3 bits. This is because you are not supposed
to type them in this manner. You will understand soon.

If pinky and ring can type any letter,
so do index and middle finger in exact same way just reflected in the mirror!

So any 2 letters with 4 fingers. So far so good.

Now thumb with 4 bits, not fully independent as not every combination can be pressed
can cover 7 positions, 4 individual bits and 3 pairs. Sadly 5 vowels so 2 are useless.
Not full bit remains. So pack vowels there.

### Palm bits



Back to hardware. Model1 io is a nice board. It has that palm button. That is good
Even on moonlander i use palm to press corner button of the board instead of pinky.
Palm is independent from fingers too! 2 Independent bits!

![](https://shop.keyboard.io/cdn/shop/files/m100-for-web.jpg?v=1706306369&width=360)

Just imagine that palm button on outer side as well.
Those I built alone using a cheap membrane keyboard monkey patching some cherries 🍒 on top. Can drop a guide if needed. For now this bit as all the guide you need.

![](http://109.92.26.132/pic/palmButtons.gif)

Now obviously I didn't ducktape that thing on and  with little cable management redistribute start record buttons across my home. Not at all.

Twist hand inward a bit,
or outward. Now we are up to 18!
We will use those as vowel positioning bits. 
* Left hand outer palm = vowel left
* left hand inner palm = vowel right

And this allows us to make any 2 consonant 1 vowel trio. With one hand.
Same but mirrored with other hand. That is any 6 letter 4 consonant 2 vowel combination.
Most of the time there are not 3 consonants adjacent and even if there are
we can process our input further without mandating memorization.

### Independence bit

Last piece. If you press both palm positions this is chord independence flag.
Meaning that chord is taken as word. Meaning you can type two short words at once
Meaning chord frequency is awesome.

So what i promised I delivered. No memorization (beyond 30 letters and muscle memory)
no language locking, as input is taken as ipa and then mapped to a word however it is
spelled (i don't really care "oui je veux" looking at you )

IPA required, hardware required. 

```  
` : |`  .,,.  ,,.. || ` `
```   
is a chord notation and lets not go into whats mapped onto it.
If you are interested decipher it using the map above :)


Guides for hardware coming soon

## Tease

Now that I just dropped this on you, trust me when I tell you.
Typing is currently least of bottleneck for thought speed HMI.
As I described here in [UX metrix](http://www.djuleayo.com/posts/uxmetrix).
But I have solution for that too! It is much more exiting then lang agnostic steno
as it enables you so much further. True R.A.H.M.I
random access human machine interface. Stay tuned.

## Code

As promised here is the code. Its a small js driver basically
that runs on linux but porting it to windows or mac should be really straightforward. Do note if you decide to run it
how beautiful low level event driven JS in fact is. Such a treat after framework land.

[GitHub repo](https://github.com/djuleAyo/lang-agnostic-steno)

Don't forget to install dependencies outside of npm (xdotool)

## Whats missing

Translating IPA into spellings layer is not there. I need to pull IPA data from somewhere. This is a POC and requires tweaking.


## Meta bracelet

I expect this kind of steno could be fully ported to [meta input bracelet](https://www.meta.com/en-gb/blog/surface-emg-wrist-white-paper-reality-labs/?srsltid=AfmBOoq1PwhcfmmWF1M3D995oefoVIIK-Sdb89sAWqKBbYif6zKmOIgc) as each button press is distinct muscle movement.
So even in that manner this training shouldn't go wasted.