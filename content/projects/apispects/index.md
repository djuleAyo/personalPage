+++
title = "Apispects"
date = 2026-11-03
description = "Reduce API contract drift and integration friction across teams. One TypeScript contract supplies the Express router, typed client, validation, and business error types."
summary = "One contract for backend and frontend: typed calls, validation, and business errors. Reduce contract drift and turn repeated integration work into a shared engineering capability."
context = "Contract drift · Developer experience · Cross-team architecture"
weight = 3
draft = false
+++

**Reduce contract drift between backend and frontend with one shared API contract.** Apispects derives an Express router and typed client from the same TypeScript declaration, including request schemas, success responses, and business errors. Teams get editor feedback as the interface changes, with fewer definitions and integration conventions to maintain separately.

{{< apispects-contract >}}

## A contribution that crosses team boundaries

**Standardize the integration work teams repeat.** Backend teams own handlers and business rules; frontend teams own the user experience. A shared contract gives both a consistent way to define endpoints, validate data, call services, and handle expected failures.

A new endpoint follows the same path from declaration to handler to client call. Improvements to that path can benefit every team using it. Producers and consumers review changes against a common contract, reducing repeated decisions about payload shapes, endpoint wiring, and error formats.

## Feedback while you code

**The contract becomes the developer interface.** Autocomplete exposes available operations, accepted inputs, returned data, and declared business errors. Type inference carries changes into controller arguments and client calls when consumers compile against the updated contract.

{{< apispects-demo >}}

There is no separate client generation command or generated client file to refresh. TypeScript derives the interfaces; `makeApi` constructs the router and client functions from the declaration.

## Define once, use on both sides

Illustrative composition; the shared contract, server setup, and client setup belong in separate modules. Imports and business logic are omitted.

```ts
// Shared contract
const spec = {
  accounts: {
    create_post: {
      bodySchema: z.object({ name: z.string() }),
      responseSchema: z.object({ id: z.string() }),
      cbErrorSchema: z.literal("Name already taken"),
    },
  },
} as const satisfies ApiSpec;

// Server: typed handler and Express router
makeController(spec.accounts.create_post, createAccount);
const { router } = makeApi(spec, {}, express.Router);

// Client: typed calls and outcomes
const { apiClient } = makeApi(spec, { baseUrl: apiOrigin });
const result = await apiClient.accounts.create_post({
  body: { name: "Ada" },
});
```

**Business errors belong to the contract too.** The handler can return the declared `"Name already taken"` case. The client receives it through the common error envelope with its payload type preserved. Consumers can handle expected failures using the interface they already share with the backend.

## Check the boundary at runtime

The server validates incoming request fields against their schemas. The client parses successful response data against the response schema; development mode also checks controller output before sending it. These checks complement the types used during development.

Shared contract versions remain part of rollout coordination when clients and services deploy independently. The design reduces drift between maintained definitions and exposes incompatible data at the checked boundaries.

Built with **TypeScript, Zod, Express, and fetch**. Explore the [source on GitHub](https://github.com/apispects/core) or the [earlier TypeScript walkthrough](/posts/ts-api-spec/).
