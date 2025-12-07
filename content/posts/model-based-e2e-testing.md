+++ 
draft = false
date = 2025-06-06T14:05:26+02:00
title = "Every user flow e2es - model-based testing / state-machine testing"
description = "Educating mini brain how to use your app results in automated e2e tests that cover every user flow with minimal effort."
slug = "model-based-testing"
authors = []
tags = ["e2e", "testing", "model-based-testing", "state-machine-testing", "playwright", "cypress", "test-automation"]
categories = []
externalLink = ""
series = []
+++

## Intro

What an exiting and strange time we live in! At the same time 
streets are poverty struck resembling void of beauty,
and I can play with miniature special purpose machine brains sitting on
gigantic legacy of modern computing. Words really is battlefront of light and dark. One of such brains can be constructed and used in app testing purposes.

# Every user flow e2es - model-based testing / state-machine testing

is end boss dream of e2e testing. Covering every user flow is implementationally
demanding. On top of it Teams claim e2es are demanding to maintain. So they opt out.
Interestingly solution lies, as its often case in life, there where we don't
want to look at.

With right code organization "every user flow" e2e testing is achievable
and maintainable for almost the same effort as "some user flows" e2e testing.

It's very obvious why would you want it, so let's dig straight into how.


## Setup

The solution lies in graphs. Lack of general purpose graph libraries is the best
tell how taboo graphs are. Yet anything done smart requires a graph. It is
after all what powers AI as well. Enough introduction lets define a graph
structure that will allow us to cover every user flow with effort
comparable if not less than "some user flows".

> UI state is node of the graph. (page, modal, panel - anything that requires user interaction)

> User interaction needed to translate from one state to another is an edge of the graph.

Idea is very simple in fact. If you know about graphs. As soon as you have
this graph you can traverse it in automated way! Thats the whole point.
UI state/interaction graph is allowing automated traversal and each traversal
is a user flow - aka e2e test.

So test are generated from the graph with given parameters.
No parameters = shortest path.
If you want to go real fancy, real analytics data can be used as edge cost.
This way tests can reflect real user behavior and be more realistic.
But for now lets not go deep into traversal control.

## User interaction library

No matter what you are testing
if you are at home page and want to open a menu, same user interaction is used.

> User interaction library is defining set of edges

this promotes 
* reusability
* maintainability
* automation

Reasons why setting up "every user flow" doesn't cost much more than "some user flows".
Or even less.

## Assertions

Content assertions can be used to verify if components are rendered correctly.
But this is sort of "glorified unit test" disguised as e2e test.

* e2es mimic user behavior
* user has no clue what should render
* he knows if data he needs is there
* if things glow green or red - do they work

In e2e tests assertions can be split into intent libraries:

One is to recognize the state of the UI. 
Another is to extract data from the UI.

### Recognizers

Recognizers search for unique piece of UI to declare UI state.

Now we see we in fact have two graphs! One is static - described so far.
It is a prescription of how to use the app. But app has states so not all
prescriptions are valid at all times. Meaning we must construct dynamic graph
that represents actual state of the app. This graph can be populated via recognizers.

Obviously these are also independent of the actual test goal. Fully reusable.

## Alternative jargon / beginner friendliness

Graphs are, practice shows, a bit scary. So lets introduce less technical jargon

static graph is experienced user. Experienced user knows how to
do stuff in the app. Graph is a brain of a user. 
Dynamic graph is new user asking for advice how to do something in the app
from experienced user.

Once initial effort to setup graph traversals is done, devs write regular 
user interaction and assertions as they would otherwise laying them out in
a set framework that defines the graph. Testing is then just declaring desired
outcome (node/ui state ie something purchased) and giving required data. Test is generated

## Extractors

Should be seen as "data extractors" - each component has an extractor that
reads the data from the UI and then that data can be compared in automatic and
dynamic manner leading into existing runtime validators of the app.
Especially if `zod` is used. This once again allows to do more with less writing.
Extractors are independent of the actual test goal. Reusable.

## Independence test

If we look at the backend as a black box, we do not know if its stateless,
stateful, or has some other state management. And we do not care.
By assigning weights to edges, possibly based on analytics data,
tests can have budgets and traverse in suboptimal ways. IE they can loop
purchasing multiple times. In such scenario user flows should still work.
Implicitly this is testing the backend for independence of implementation
with respect to growing state. 
