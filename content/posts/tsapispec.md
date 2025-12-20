+++ 
draft = false
date = 2025-12-20T11:13:48+02:00
title = "TS API Spec"
description = ""
slug = "ts-api-spec"
authors = []
tags = ["typescript", "meta-programming", "generics", "schemas", "SSOT"]
categories = []
externalLink = ""
series = []
+++

# TS API Spec

- npm: https://www.npmjs.com/package/@apispects/core  
- repo: https://github.com/apispects/core  

---

## TS-first API spec with superb DX

{{< figure src="/tsapispec.demo.gif" >}}

Everything is autocompleted and type-checked.  
As soon as the schema is satisfied, the error disappears.

No separate spec file.  
No generation step.

---

## The problem this targets

Most teams still pay the same tax:

- duplicated contracts (controllers, OpenAPI, generated clients)
- contract drift between backend and frontend
- stale generated code
- runtime bugs shipped by “green” builds

The root cause is structural:  
**the contract is treated as an artifact, not as the boundary.**

---

## Benefits

- **Maximum code sharing between nodes** (assuming JS/TS)
- **Fully typed end-to-end**, including error cases
- **Uniform error handling** across server and client
- **Single source of truth**: router and apiClient are generated from the same spec

Optional runtime validation can be enabled in non-prod without changing the contract.

---

## Overlap with existing approaches

This overlaps with:
- OpenAPI + codegen
- RPC frameworks
- shared schema repos

**Difference:** those generate code *from* a spec.  
Here, the spec *is* the code boundary.

---

## Why this is especially leveraged in JS/TS

JS has an unfair advantage:
- same language on backend and frontend
- TypeScript as the shared type system

That enables:
- zero drift
- zero regeneration
- no stale specs

---

## Example

Declare your spec once:

```ts
export const authRouter = {
  register_post: {
    bodySchema: registerRequestSchema,
    responseSchema: z.object({ token: z.string() }),
    cbErrorSchema: registrationError,
  },
  login_post: {
    bodySchema: loginRequestSchema,
    responseSchema: z.object({ token: z.string() }),
    cbErrorSchema: loginErrors,
  },
  refreshToken_post: {
    headerSchema: authHeader,
    cbErrorSchema: z.null(),
    responseSchema: z.object({ token: z.string() }),
  }
} as const satisfies ApiSpec;

export const apiSpec = {
  api: {
    auth: authRouter,
    macro: macroRouter
  }
} as const satisfies ApiSpec; // key line (TS 5)

//Generate both router and client from the same spec:

const { router: apiRouter } = makeApi(apiSpec, {}, express.Router);

//Controller implementation is fully typed by construction:

makeController(
  authRouter.register_post,
  async ({ body: { email, name, password } }) => {
    const user = await registerUser(email, name, password);

    if (typeof user === 'string') return user; // typed error case

    return { token: jwtSign({ userId: user.id }) };
  }
);

//And the client derives from the same contract:

export const { apiClient } = makeApi(apiSpec, {
  baseUrl: 'http://localhost:3033'
});
```

If you violate the contract on either side, TypeScript complains immediately.

---

## How it’s built

- **Parser types** (the core mechanism):  
  http://djuleayo.com/posts/parser-types/
- **TypeScript 5 + Vite** for clean cross-module sharing

---

## What this optimizes for

- correctness over ceremony  
- DX over documentation  
- contracts that cannot drift by construction  

If you can break the contract without TypeScript complaining, the setup is wrong.
