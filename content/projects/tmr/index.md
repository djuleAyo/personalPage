+++
title = "TMR — theMonoRepo"
date = 2026-11-06
description = "TMR: Web and Unity shells, Exobrain, Molecule and PIM, Worker Studio, Compass, transformer graph heads, lattice groups and continuous 3D visualization of language structure."
summary = "My main personal project. Web and Unity implement Shell; Web hosts Worker Studio and Compass. Exobrain contains the Molecule SSOT graph and PIM linearizer. Shell streams reach Mixer, which uses local models and emits events on NATS."
context = "Personal project · Systems architecture"
weight = -1
draft = false
layout = "platform"
platform = true
demo_url = "https://www.linkedin.com/posts/andrej-jovanovic-618b231a3_exobrain-xr-activity-7524104250797543424-L9XL"
+++

TMR (**theMonoRepo**) is my main personal project.

{{< platform-demo >}}

## Infrastructure

{{< platform-system >}}

## Shells and applications

The user interacts with a shell. **Web and Unity implement Shell.** Web contains Worker Studio as an application; Unity presents spatial surfaces in glasses. Shells carry user input to PIM. Driver agents can also supply input directly to PIM.

## Exobrain

**Molecule is the SSOT graph; PIM is its linearizer.** Exobrain contains the graph, interaction runtime and services. PIM resolves shell and driver-agent input against the graph.

Worker Studio connects pluggable coding-agent providers. Reader handles reading state and speech playback. Recognition, synthesis and other model execution belong behind service interfaces.

## Streams and events

**Shells → Mixer → NATS.** Shells supply video and audio streams. Mixer invokes local models and receives their results, then emits events on NATS for subscribers.

The diagram is an architecture sketch. The recording shows Worker Studio running in glasses on November 5, 2026.

[PIM: interaction model and runtime](/projects/pim/)

## Compass: semantic graph navigation

**Compass renders the semantic neighborhood of an object.** Inheritance, dependencies and composition are visible in both directions: inherits from / derived types, depends on / used by, properties / property of. Follow a relation, inspect a node, or make it the new center.

{{< platform-compass >}}

The graph keeps its identities across navigation paths. A shared ancestor can appear through several inheritance routes without becoming several objects; cycles have explicit boundaries. The focus surface and radial sectors are two renderers over the same model and navigation state.

## From semantic space to language structure

**A transformer's graph head outputs Molecule expressions.** The head maps representations in an *m*-dimensional semantic space into expressions of objects, relationships and composition. Interpreting those expressions yields explicit language structure in the shared graph.

{{< platform-graph-head >}}

The graph head and expression interpreter together define a function from semantic space into language structure. The model's *m* latent dimensions and the language's *n* structural dimensions serve different roles: one carries a learned representation; the other makes distinctions explicit and available for navigation, evaluation and interaction.

## Lattice groups: language in n dimensions

**Lattice groups organize language structure across overlapping semantic dimensions.** A group describes constraints an object satisfies; intersections form more specific groups. Types, capabilities and other semantic distinctions give objects several simultaneous positions in that structure. Inheritance, dependencies and composition connect them through different relation families.

The diagram takes a three-dimensional slice: **Readable, Editable and Navigable**. A document can belong to all three groups. Moving through their intersections changes the constraints under consideration while preserving the document's identity.

{{< platform-lattice >}}

**UI polymorphism follows the same language structure.** Capabilities determine applicable operations and compatible readers, editors and navigators. A change of presentation preserves the object underneath. Compass demonstrates this rendering boundary directly: switching its layout retains the focused graph and current paths.

## Continuous 3D views of language

**General language structure is the subject of the visualization.** The rendering architecture maps a selected region of that *n*-dimensional structure into a navigable 3D view. Focus, relation families and level of detail determine what is exposed. Continuous navigation changes the view while preserving graph identities, group memberships and relationships.

{{< platform-language-view >}}

**Hyperbolic geometry gives branching structure room around the focus.** In a bounded 3D view, distant context compresses toward the boundary; bringing a region into focus reveals its local detail. A hierarchy can guide spatial placement while shared nodes and cross-links retain the graph's richer structure. [H3's 3D hyperbolic graph layout](https://graphics.stanford.edu/papers/h3/html/h3.htm) is a reference for this focus-and-context approach.

The language dimensions remain in the model. The renderer chooses a spatial view of them, with continuous transitions as the focus moves. Compass and the recording above show graph interaction and rendering; the hyperbolic layout describes the wider visualization architecture.

## Harnesses, data and metadata ownership

**Molecule / Chant is designed as a general-purpose substrate for harnesses.** Tasks, tool contracts, execution state and results share an explicit language and graph. Different harnesses can coordinate models and tools around that representation.

**An additional capability advantage over existing harnesses remains unproven.** The stronger motivation is ownership of the information produced and accumulated through their use.

That includes both **data**—inputs, documents, generated artifacts and results—and **metadata**: stable identities, types, relationships, provenance and execution context. The aim is to retain these together in storage the user controls, with representations that remain inspectable and usable across applications, models and harnesses.

Ownership therefore becomes an architectural requirement: inspectable definitions, portable serialization and control over persistence and access. Changing a model or execution framework should preserve the accumulated information and the structure needed to interpret it.
