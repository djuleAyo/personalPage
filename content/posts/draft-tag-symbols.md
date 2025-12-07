+++ 
draft = true
date = 2025-05-29T08:09:24+02:00
title = "Symbol tagging"
description = ""
slug = ""
authors = []
tags = []
categories = []
externalLink = ""
series = []
+++


# Symbol tagging


What is symbol tagging and why you should do it?

In [this post](http://www.djuleayo.com/posts/module-tradeoffs) about tradeoffs
of module management I opened a question of when it is worth striving for reusable code.
In short, reusable code is great in theory until you discover it is much harder to write
it, predict all usecases and patch it. So you have to weight the mentioned tradeoffs.

There are cases when reusability is not achievable due to completely different
reasons then module management. One of such cases is naming.
That is not suprising as naming is one of the hardest problems in programming.

Cursed naming problem of the programming. You dont discover it until you dig deep
so its kind of hard to paint the pain of it if you never experienced it.
But this example is in fact quite illustrative.

## Example

Let's assume an UI. UIs value UX and consistency. So you make a design system.
Besides just css values and variables, you are forming a feedback language
that represents your UX. Now you don't want to diverge from mainstram expectations,
ie when you press a button and request is in flight you show a spinner and disable the button.
Or in general, UI responds to user input all the time. But you don't want to
blend it completely and still want to have your own flavor. So you reinvent the wheel.
Or not that is not the point. The point is whatever you choose to do,
you will compile a library of components and reuse it. Owning it or not.

Now in the name of consistency you start adding components to your, usually named
`ui-toolkit` and discover how naming curses you.

Assume this component:

{{< figure src="/componentExample.png" title="My Caption" >}}

Now lets speculate what this component is.

It could be a title with an icon. Or just some text with an icon.
Semantic meaning of it is not clear based on how it renders.

And what are the limits of reusability? Well if it renders the same it can be reused.

So reusability is directly tied to if it renders the same but semantic meaning
is not. 

Reusability also depends on few more things. People know it exist so they can use it.
They know how to find it. Now it happens very often parts of UI are repeated
but not part of the ui-toolkit and reason for that is exactly naming.

Lets propose some names for this component:
- titleWithIcon
are we using "with" in names or not?
are we assuming semantic meaning of title or are we trying to make it as reusable as possible?
I'd say title is excess as it restricts the usecase.
Ok lets ditch title from the name
iconAndText - its bloody generic, there may be Icon on either side, and combined
with 1 of 5 text variants.

Ok then:
- iconLeftMediumText

you come one week later and forget if it was leftIconTextMedium or any other permutation.
This is just one name but imagine dozen and you will realize how easily this can
be forgotten. Or discuss word order with your team. As if thats gonna go smoothly.

You can continue name proposals and discover whatever, literally whatever you name it,
its not good. If you name it short its too generic, if you name it long enough
you need to stamp half of the implementation in the name it self and even if you
do that it will be forgotten as nobody remembers such names nor can find them easily.

And sad part is everybody recognizes the component once rendered to the screen
Its as if render of it is better name and identification then implementation name,
or any short insufficient name.

Well we can't use images as identifiers, yet. So what to do?

## Conclusion

> There is class of names that must be ugly

That class is described by the example above but there are many more.
You make short name - you mandate your developers must remember a name per each.
And this directly translates to cost as team is always changing. People come and go.
You make long name - then they need to speak about word order and amount of details
to put in the name. And then they forget it anyway.
The truth about such names is

> Those objects are anonymous.

So in example of given component, it 100% identified by its render,
not by a fake name, not even by imlementation as most of us don't have rendering
engine in our head.

## Solution

As always truth sets us free. It is sometimes painful and this example is no different.
The object is anonymous. So how to find it?
If we examine the problem we get when we choose to set a lengthy name that leans into
implementation details, we discover its hard to remember word order. Maybe not
for one object but certainly for a collection.

Let's dodge that problem. We don't care for word order.

Medium text icon left is the same as icon left medium text.
We are using those words as tags, as keywords. Any permutation of those words should do.
That functionality is exactly what 
[this vscode extension](https://marketplace.visualstudio.com/items?itemName=djuleayo.keyword-search)
does. Ok so now you can search for whatever permutation and use that even to find
functions with certain argument types or return types.

Now you have two choices: put identifying implementation details in the name
or in jsdoc like this:

```tsx
// @keywords icon left medium text
export default function () {}
```
and even use an anonymous object which mandates you name it in place of usage,
where obviously you know what it is used for and how it is used, so its easy to name it.
This allows you to make no assumptions about the component.
Neither semantic meaning nor implementation details. If you want to use it
as a title, you can. If you want to use it as a text, you can.
Or even a list element. Anonymous symbol that can be easily found by an
tag permutation, is not making assumptions and can be easily reused.

Now its not hard to imagine how this problem is translated to other non UI components.
UI example is, well, illustrative.

Problems:


This is only half of the solution. If we leave it like this there are problems incoming.
Inconsistency in tagging. What use are tags if they are not consistent?
If what you are trying to find was once tagged correctly but then
its also starting to disappear in semi indexed mess of tags.
It is probably better to have nothing then semi indexed mess.

Can we enforce tag consistency?

## Custom importer

If you allow your self to add yet another transpilation step to your build,
and forget not, js/ts is transpilation hell platform. So your stance may differ.
Toss in another on top of a pile, or not by any means!

For the sake of argument, and exiting play lets do it, because if building a micro search engine
for symbols is not exciting, I don't know what is. 😎

So an importer with syntax similar to this:

```js
import keywords(some fancy query) as nameOfOneObjectWeExpect expect 1;
import keywords(icons public svg) as icons
```

will enforce consistency of tags as you are using them to import symbols so they are
not just an appendix.

Compiling a list of anonymous or not, tagged symbols with custom babel importer
certainly is bold move. And we just made a full circle. If you feel the pain
of naming enough you will be eager to try it. Even if you don't
keyword search is looking good. Imagine browsing your storybook
but search box supports tags, as you type it shows you all components
you recognize the one via its render and selecting it gives you import path,
or full tag collection, or identifier if you have it.

You don't have to imagine it. Here is how it looks:

{{< figure src="/tagSearch.gif" title="Tag search" >}}

Symbol tagging allows you full logical expression of tags search over collection of symbols.
A mini search engine that directly attacks the naming problem.

Now this is not a silver bullet. Some objects do have name, or semi ugly names
that can live a word accustomed to nominal referencing. But at least a class of
names would love not to exist and be referenced in more descriptive ways
than by a name.