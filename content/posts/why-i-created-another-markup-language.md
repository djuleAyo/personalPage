+++ 
draft = false
date = 2025-09-14T09:22:50+02:00
title = "Why I created another markup language"
description = "UX complexity is the missing development metric. It is the cost of interaction and arguably the most important metric."
slug = "why-i-wrote-another-markup-language"
authors = []
tags = ["perspective", "system design", "innovation"]
categories = []
externalLink = ""
series = []
+++

# Why I created new markup language?

Yet another time to call something "yet another"
this time it is markup language.
Yet another markup language...
Why?

## Current

HTML/XML is fair example.
They are in essence as simple as it gets. 
<address>some address</address>
You are marking up things. If we rewind more we find out HTML was intended
to be
* human readable
* easy to write
* easy to index!

All that marking up was in days of early web to state what is what in mostly textual files
and allow search engines to index it properly. Later on HTML became the most coupled
tech in existence having some tags with semantic meaning, some with
presentation meaning and some with both, then script tags and what not.
This is because it was repurposed to follow the ever growing needs of web.

The fact remains, You are marking up things and in process define trees.
HTML is a tree of data. So is XML. So is JSON.
While I went deeper into why and when trees are insufficient in the book,
here Ill go briefly. HTML anticipated these insufficiencies and decided
to bridge them with anchor tags. And that is - tree simply can't define as much as
general graph can. So instead of defining coherent/atomic units of data, reference 
what you need. Those familiar with graphs will immediately recognize this 
leads to possibility of cycles. Cycles = problems and non determinism in many cases.
Or simply "oops this page can't be found"

To address the central lack of trees:

laying data in trees is natural when we describe single taxonomy


data is often viewed in multidimensional way and tree requires proclaiming one categorization
as superior which is ambiguous and not self contained

All this is the setup and something I named:

> core coupling of programming


and that is we couple address/location with reference
yet it is obviously coupling of two orthogonal concepts.

As proof:
* array index is memory location and reference
* url is location and reference literally
* file path is location and reference
* variable name is location and reference
* namespace, module, etc...

Yet human centric way is absolutely different. We reference without location all the time.
Yes we have search engines and they allow us to reference without location using
natural language. More or less. 
And this is reason why

## Graph Markup Language

was created and lays data in graphs instead of trees.

This line of thinking proved it self very fruitful and as consequence
of such a language came many innovative concepts which i termed ELM
ELM - evolving language model
is consequence of raising hierarchies from static to dynamic
generalizing them and using them for dynamic language generation.
Dynamically generated languages allow for ELM embodied in trinity of 
data <-> language <-> interaction

What I'm talking about is 
* deterministic 
* interactive 
* associative search
* with data space visualization

Laying data in graph in such a way that elevates even relation as first class citizen
and allows for dynamic generation of languages arisen from data itself.
This dynamic language is formal and keeps all the properties of formal languages
- determinism.

To put it shortly expressions of GML define graphs, subgraphs which form mini brains
capable of talking in multidimensional way about data.

Read more in the book