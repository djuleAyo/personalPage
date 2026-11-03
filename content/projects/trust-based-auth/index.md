+++
title = "Trust Based Auth"
date = 2026-11-03
description = "Trust based auth removes sign-up and repeat verification friction. Telephony connects calls, SMS, and web sessions; successful interactions earn direct access."
summary = "Earn trust through successful interactions. Remove sign-up, passwords, and repeated verification. Connect phone calls and SMS directly to the web experience."
context = "Authentication · Friction removal · Telephony"
weight = 1
draft = false
+++

**Trust based auth removes sign-up, passwords, and repeat verification.** Successful interactions earn direct access. Telephony connects calls to web intent, and SMS activates a remembered browser session. Returning users act directly while the server checks current permission.

{{< trust-journey >}}

## Friction removal by design

The app lets people express intent before asking them to establish an identity. Their work is already captured when the first call confirms the interaction, and successful fulfillment earns a shorter path next time.

Trust carries forward across visits. SMS activation establishes the browser session; it does not interrupt every subsequent action. A new browser or an expired session needs activation again.

## Telephony integration

**The phone call arrives with context.** An Asterisk/GSM gateway sends call events to the web application, where the caller's phone number is connected to saved intent. An operator can see what the person has already selected. If there are multiple candidate carts, a short cart code resolves the match.

{{< telephony-integration >}}

The same integration carries SMS activation back to the user's phone. Calls, saved web intent, and session activation become parts of one flow, reducing repeated explanations and data entry.

## Trust follows outcomes

**Fulfilled commitments unlock direct access. Recorded no-shows restrict it.** An operator confirms the outcome; the server updates the user's trust state.

{{< trust-outcomes >}}

New phone numbers start as `UNKNOWN`. A confirmed fulfillment changes the user to `TRUSTED`; a recorded no-show changes them to `NOT_TRUSTED`. The current implementation uses completed orders as the evidence for these decisions.

The model also supports `MEDIUM`, which permits direct orders with the possibility of operator review. The outcome handler currently assigns the trusted and restricted states; it does not automatically assign this intermediate state.

## Keep permission current

**A remembered browser still needs current permission.** SMS activation establishes access to a phone-linked session. The outcome history determines whether that user is eligible to act directly.

At every direct checkout, the server checks session validity, the matching phone number, and the user's current trust state. A restriction takes effect even if the browser still has a valid session.

Session tokens are hashed on the server and carried in an HttpOnly cookie. Activation codes expire and have limited attempts. Trust changes record the previous state, new state, related order, and responsible operator.

## Implementation

Built with **Next.js, TypeScript, Prisma, and SQLite**, with **Asterisk/GSM** for calls and SMS. The operator workspace brings call context, saved carts, fulfillment, and trust decisions together.
