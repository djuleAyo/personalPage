+++
title = "TMR — theMonoRepo"
date = 2026-11-06
description = "An experimental computing environment for people and agents to interact with shared semantic objects through web, voice and spatial interfaces. Coding agents, graph navigation and a declarative interaction runtime."
summary = "An experimental computing environment bringing together coding agents, graph navigation and a declarative interaction runtime. People and agents interact through web, voice and spatial interfaces, with a shared semantic graph as the architectural direction."
context = "Personal project · Systems architecture"
weight = -1
draft = false
layout = "platform"
platform = true
demo_url = "https://www.linkedin.com/posts/andrej-jovanovic-618b231a3_exobrain-xr-activity-7524104250797543424-L9XL"
+++

**TMR (theMonoRepo)** is my experimental computing environment for people and agents to interact with shared semantic objects through web, voice and spatial interfaces. It brings together coding agents, graph navigation and a declarative interaction runtime.

{{< platform-demo >}}

**Working components shown here:** Worker Studio in glasses, Compass over an example graph, and the [PIM command runtime](/projects/pim/). The complete integration around a shared semantic graph is still in progress. Transformer graph heads and a hyperbolic language-graph renderer are research directions; the infrastructure diagram describes the wider architecture.

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

## Walkthrough: make Readable the center

Start with **Document** at the center of Compass and **Readable** selected in its **Inherits from** relation. This walkthrough follows the current Worker Studio command wiring:

1. **Input.** Say “worker studio” to enter its interaction context, then “compass focus.” The voice adapter supplies the recognized words.
2. **PIM resolution and dispatch.** PIM selects the Studio interaction frame and forwards the utterance into the application. Studio's registered voice matcher resolves “compass focus” to the Compass action `focusSelected()`. PIM owns the application context; the renderer's matcher owns this command binding.
3. **Graph operation.** Compass resolves the selected occurrence to the existing node identity `readable`, changes its navigation model from `focusId: document` to `focusId: readable`, and projects the new focus's outgoing and incoming relationships.
4. **Interface update.** Readable becomes the center. Entity appears under **Inherits from**; Document appears under **Derived types**. The same objects now appear in a different neighborhood.

**This is graph traversal and a view-state change over an example graph.** A persistent edit to the Molecule SSOT graph remains a separate integration step. In the embedded demo, select Readable and press **Focus selected** to reproduce the graph operation and interface update; the embed does not include Worker Studio's voice adapter.

## Research direction: a transformer graph head

**The proposed graph head would output Molecule expressions.** It would map a model's semantic representation into expressions of objects, relationships and composition, which an interpreter could turn into explicit graph structure.

**There is no trained graph head or demonstrated model input/output pair in the current prototype.** Model architecture, training objective and evaluation remain to be specified. The diagram describes the interface being investigated.

{{< platform-graph-head >}}

In this interface sketch, *Sₘ* denotes the model representation space; *m* would be its chosen feature width. *Hθ* denotes a head with learned parameters *θ*, *ExprMolecule* the target expression language, and *L* the interpreted graph structure. These names specify the proposed mapping. They do not supply a trained function or identify latent coordinates with language concepts.

## Lattice groups: capability requirements

**Here, a dimension means one chosen Boolean capability predicate.** Take *C* = {Readable, Editable, Navigable}: there are *n* = |*C*| = 3 such dimensions. Each object either satisfies a predicate or does not. These are classification axes, distinct from a model's latent features and the coordinates of a 3D view.

Each point in the diagram is a **requirement set** *S* ⊆ *C*. Its group contains the objects satisfying every requirement in *S*. For example, {Readable, Editable} describes the intersection of readable and editable objects. “Lattice groups” here refers to groups indexed by these requirement sets.

The ordering is specialization: **S ⪯ T exactly when S ⊇ T**. More requirements means more specific, shown lower in the diagram. This gives the Boolean lattice of requirement descriptions, with:

- **Meet: S ∧ T = S ∪ T.** Combine the requirements. The meet of {Readable} and {Editable} is {Readable, Editable}.
- **Join: S ∨ T = S ∩ T.** Keep the common requirements. Those two singleton sets have no shared requirement, so their join is ∅, labeled **Object**.
- **Top: ∅. Bottom: C.** Object imposes none of these requirements; the bottom point imposes all three.

{{< platform-lattice >}}

The join is the least common requirement description; its matching group can contain more objects than the union of the original two groups. The example does not require every group to have members, and it does not establish that the entire language graph forms a lattice. General language structure also carries dependencies, composition and other relationships.

**The UI-polymorphism design uses these capability descriptions to resolve applicable operations and presentations.** A change of presentation preserves the object underneath. Compass demonstrates the rendering boundary directly: switching its layout retains the focused graph and current paths. A general capability-based presentation resolver is a broader integration goal.

## Continuous 3D views of language

**General language structure is the subject of the visualization.** The research direction is to lay out a selected region of that graph in a navigable 3D view. Focus, relation families and level of detail would determine what is exposed. “Continuous” refers to navigation and view transitions while graph identities, group memberships and relationships remain stable.

{{< platform-language-view >}}

**Hyperbolic geometry gives branching structure room around the focus.** In a bounded 3D view, distant context compresses toward the boundary; bringing a region into focus reveals its local detail. A hierarchy can guide spatial placement while shared nodes and cross-links retain the graph's richer structure. [H3's 3D hyperbolic graph layout](https://graphics.stanford.edu/papers/h3/html/h3.htm) is a reference for this focus-and-context approach.

Capability predicates and other semantic distinctions remain in the model. The renderer chooses a spatial view of the graph. Compass and the recording above demonstrate graph interaction and rendering; they do not establish an implemented hyperbolic embedding of the language structure.

## Harnesses, data and metadata ownership

**Molecule / Chant is designed as a general-purpose substrate for harnesses.** Tasks, tool contracts, execution state and results share an explicit language and graph. Different harnesses can coordinate models and tools around that representation.

**An additional capability advantage over existing harnesses remains unproven.** The stronger motivation is ownership of the information produced and accumulated through their use.

That includes both **data**—inputs, documents, generated artifacts and results—and **metadata**: stable identities, types, relationships, provenance and execution context. The aim is to retain these together in storage the user controls, with representations that remain inspectable and usable across applications, models and harnesses.

Ownership therefore becomes an architectural requirement: inspectable definitions, portable serialization and control over persistence and access. Changing a model or execution framework should preserve the accumulated information and the structure needed to interpret it.
