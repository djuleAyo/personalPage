+++ 
draft = true
date = 2025-06-24T14:58:17+02:00
title = ""
description = ""
slug = ""
authors = []
tags = []
categories = []
externalLink = ""
series = []
+++


Some languages support traits. Traits are trivially implemented interfaces.
So you have a **zero** interface and you trivially implement it simply by
annotating it. This is interesting scenario that points directly to more fancy
languages and language features like rust, haskell, scala etc.
Those functional beasts go into limitations of human comprehension which quickly
declines with rising level of abstraction. But traits, as I see it is a widely
accepted concept throughout the programming world.

So what do traits allow us? In essence you can declare what a trait and implement
it elsewhere. Or not implement it at all.
As trait is a zero interface, name of the trait is only carrier of information.
And those names are organized in trait hierarchies as traits can extend other traits.

If you imagine simple tag system like you have in *youtube* lets say:
music, games, sports, etc
Its clear the intent of those tags but in more complex scenarios:

email could be:
* a regex
* scalar type
* string
* a property of an object

such a tag is ambiguous and would make a good use of hierarchical disambiguation.

* user/email
* scalar/email
* input/email

Maybe the example could be even more illustrative, but I think you get the point.
I used path to disambiguate and path is exactly what matches a position in a tree.

So you could use traits for structured tags. While vectors of data indexing have abstract meaning
for its coordinates, structured tags have binary outcome. And inheritance included

With this setup in mind we can say a document has a signature.
Signature is binary vector of traits that are organized in hierarchies.

Here we come to a great use of roaring bitmaps.

Sad times of vibe coding have come and even among developers I recon alarming number of them
has no clue what a bit map is. Let alone roaring bitmaps. But worry  not if you dont. I leaving
you breadcrumbs to follow. In this post I provided highly inlustrative example for use of 
bitmaps. But back to exciting stuff.

Roaring bitmap and be used as a signature of a document where each bit is a trait.

Roaring bitmap provides efficient set operations and optimization of encoding.
Freaquently used traits can be ordered on vector positions so that operations are faster.
Aint that great?

And here comes the crown. In such setup I described, where you used multihierarchical tags/labels
bits of roaring bitmap to sign documents, great way to provide highly intuitive UX would be based
of partial ordering of subsets.

Lets give few definitions:

Fragment is all documents that are under the same signature.

We would like in almost constant time to know ordering in sense of subset between fragments.

So final structure is a tree of fragments where each fragment is a set of documents with that
signature. Fragments on same branch (path) of a tree are edit distance 1 apart.

Such a tree gives us 
* graph fragmentation in its components
* efficient set operations on fragments

And is in essence deterministic structure for data indexing.
While many kinds of data in fact need indexing that is abstract in its coordinates,
like pictures and text, anything exact, IE entire codebases could and should be indexed
in relational manner instead of nominal as each document in fact is looked in many
different hierarchies out of which none can be declared as primary.