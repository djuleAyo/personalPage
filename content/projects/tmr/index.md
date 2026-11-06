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

## Molecule: code, data and execution in the graph

**Molecule's intended design is a homoiconic, metacircular Zig/Lisp cross.** Homoiconicity means code and data share a manipulable representation; metacircularity means expressing the evaluator in the language it evaluates. Here that representation is a graph. The intended runtime carries execution state explicitly, rather than making the host function-call stack the execution model. Object references belong to identities, independently of organizational location.

The current Chant engine is a TypeScript prototype with graph-backed expressions, bindings, calls and macro expansion. The self-expressed evaluator and execution without reliance on the host call stack remain design goals.

## Streams and events

**Shells → Mixer → NATS.** Shells supply video and audio streams. Mixer invokes local models and receives their results, then emits events on NATS for subscribers.

The diagram is an architecture sketch. The recording shows Worker Studio running in glasses on November 5, 2026.

[PIM: interaction model and runtime](/projects/pim/)

## Lattice groups: one object, many organizations

**Lattice groups organize shared objects through multiple relations and coexisting hierarchies.** A document can belong to a project, have an author, be produced by a task and be referenced by another document. These relationships provide several ways to find and work with the same object. No single containment tree has to become the authoritative organization of everything.

**Identity belongs to the object; organization lives in its relations.** Relations are first-class parts of the shared structure, with their own types and identities. A view can follow selected relations in a chosen direction to derive a hierarchy for its current context: projects and their documents, people and their work, tasks and their outputs, or documents and their references. Those views can coexist.

{{< platform-lattice >}}

In the example, **Release notes is one object, `doc:42`**. Changing its project membership from Atlas to Boreal changes that relationship. Its author, producing task and the reference from Review memo remain attached to the same document. Repeated appearances in the four views are occurrences of that one object. Reorganization does not inherently require copying the document or rewriting unrelated references.

**A persistent reference and a relational query answer different questions.** A stored reference to `doc:42` identifies the document itself. “Documents in Atlas” asks what currently belongs to Atlas, so its result correctly changes after the move. A reference obtained from an earlier query can still identify `doc:42`; rerunning that query can return a different set of objects.

This separation requires an explicit identity and persistence contract. Multiple hierarchies alone do not guarantee durable references. Current Chant and Compass preserve shared identities within graph operations and projections; reference lifetimes across storage and integrations are part of the broader integration work. “Lattice groups” names this relational organization in the project; it does not assign universal meet/join operations to the whole graph.

The motivation is developed in [Why I created another markup language](/posts/why-i-wrote-another-markup-language/), with relational discovery and interaction explored in [Dynamically Generated Languages](/posts/dynamical-languages/).

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

## Capability interfaces and UI polymorphism

**Capabilities are another application of the shared structure.** An object can be Readable, Editable and Navigable at the same time. Those descriptions can guide the selection of a Reader, Editor or Compass presentation while preserving the object's identity and relationships. A capability grouping is one way to organize objects alongside their projects, authors and other relations.

Compass already preserves its focused graph and navigation when switching layouts. Resolving presentations automatically from general capability descriptions remains a broader integration goal.

## Research direction: a transformer graph head

**The proposed graph head would output Molecule expressions.** It would map a model's semantic representation into expressions of objects, relationships and composition, which an interpreter could turn into explicit graph structure.

**There is no trained graph head or demonstrated model input/output pair in the current prototype.** Model architecture, training objective and evaluation remain to be specified. The diagram describes the interface being investigated.

{{< platform-graph-head >}}

In this interface sketch, *Sₘ* denotes the model representation space; *m* would be its chosen feature width. *Hθ* denotes a head with learned parameters *θ*, *ExprMolecule* the target expression language, and *L* the interpreted graph structure. These names specify the proposed mapping. They do not supply a trained function or identify latent coordinates with language concepts.

## Continuous 3D views of language

**General language structure is the subject of the visualization.** The research direction is to lay out a selected region of that graph in a navigable 3D view. Focus, relation families and level of detail would determine what is exposed. “Continuous” refers to navigation and view transitions while graph identities, group memberships and relationships remain stable.

{{< platform-language-view >}}

**Hyperbolic geometry gives branching structure room around the focus.** In a bounded 3D view, distant context compresses toward the boundary; bringing a region into focus reveals its local detail. A hierarchy can guide spatial placement while shared nodes and cross-links retain the graph's richer structure. [H3's 3D hyperbolic graph layout](https://graphics.stanford.edu/papers/h3/html/h3.htm) is a reference for this focus-and-context approach.

Relations, group memberships and object identities remain in the model. The renderer chooses a spatial view of the graph. Compass and the recording above demonstrate graph interaction and rendering; they do not establish an implemented hyperbolic embedding of the language structure.

## Throne: layered attention

**Throne is the design for a unified, general-purpose interface to this structure.** Layered attention gives the current object or activity the richest presentation, keeps its working context nearby, and retains the wider structure in the periphery. Bringing something into focus changes the detail and interaction available around it while preserving its identity and relations.

The same structure is intended to support **2D, 3D and hyperbolic views**: a screen layout, a spatial scene, or a focus-and-context projection. These are different geometries for organizing attention over shared objects. The design brings applications, media and agent activity into the same interface.

{{< platform-throne >}}

**Nodes can be “emotionally overloaded.”** A node can carry video, a reel, sound, motion and visual associations alongside its structured meaning. The aim is maximum expressive density: a medium that conveys narrative, atmosphere and recognizable context within the object’s presentation. A compact peripheral node could unfold into a playable scene, a document or an editor as it receives attention. Its media is a presentation of the same object, with its references and relationships intact.

{{< platform-throne-origin >}}

## Harnesses, data and metadata ownership

{{< platform-harness-symbols >}}

**Molecule / Chant is designed as a general-purpose substrate for harnesses.** Tasks, tool contracts, execution state and results share an explicit language and graph. Different harnesses can coordinate models and tools around that representation.

**An additional capability advantage over existing harnesses remains unproven.** The stronger motivation is ownership of the information produced and accumulated through their use.

That includes both **data**—inputs, documents, generated artifacts and results—and **metadata**: stable identities, types, relationships, provenance and execution context. The aim is to retain these together in storage the user controls, with representations that remain inspectable and usable across applications, models and harnesses.

Ownership therefore becomes an architectural requirement: inspectable definitions, portable serialization and control over persistence and access. Changing a model or execution framework should preserve the accumulated information and the structure needed to interpret it.
