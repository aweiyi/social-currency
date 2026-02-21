# Feature Requirement Document: Narrative Layer

## Feature Name

Narrative Layer (On-Demand Stories)

## Goal

When the user selects an event or an agent in the FavourNet app, offer an optional “Generate story” (or similar) action that calls the Groq API once to produce a short narrative based on the agent’s profile and the event context. This is an optional, on-demand feature to make the simulation more engaging without running LLM during the simulation loop.

## User Story

As a user viewing the simulation or the event feed, I want to request a short narrative for an event or agent so that I can get a human-readable story (e.g. “Alex just defaulted—here’s what happened…”) generated from their profile and behaviour.

## Functional Requirements

1. **Trigger** — User can trigger narrative generation from (a) the agent detail view (e.g. “Tell me a story about this agent”) or (b) an event in the event feed (e.g. “Explain this event”). One trigger = one Groq API call.
2. **Request** — The app sends to Groq a prompt that includes: relevant agent profile (name, background, personality, economic_style, and optionally recent event type—e.g. default, redemption, large trade). Model: e.g. llama-3.3-70b-versatile or equivalent. Temperature and max_tokens set for short, creative narrative (e.g. 0.8, 500).
3. **Response** — The API response (plain text or JSON with a text field) is displayed in the UI (e.g. in a modal, expandable section, or under the event). No streaming required; show result when the request completes.
4. **API key** — Groq API key is not hardcoded. It is supplied via environment variable (e.g. `VITE_GROQ_API_KEY`) or a settings input that is not persisted in repo. Document in README that the key is required for this feature.
5. **Loading and error states** — While the request is in flight, show a loading indicator (e.g. “Generating story…”). On failure (network error, 4xx/5xx, or invalid key), show a clear error message (e.g. “Could not generate story. Check your API key.”) and do not crash the app.
6. **Rate limiting** — No automatic retry on 429; show a user-friendly message (e.g. “Rate limited. Try again in a minute.”). Optional: disable the “Generate story” button for a short cooldown after each success to avoid accidental spam.

## Data Requirements

- **Reuse**: Agent object from store (for profile); event object or transaction (for event type, counterparty, category). No new persistent tables.
- **No storage of narratives**: Generated text can be shown in UI only; no requirement to save to backend or local DB. Optional: keep last generated narrative in component state until user dismisses or triggers another.

## User Flow

1. User has agent detail open or is viewing the event feed.
2. User clicks “Generate story” (or “Explain this event”) for the current agent or selected event.
3. App shows “Generating story…” and sends one request to Groq with context (agent + optional event).
4. On success: narrative text is displayed in the UI; user can read and dismiss.
5. On failure: error message is shown; user can try again or dismiss.
6. User can trigger again for another agent or event; each trigger is a new request.

## Acceptance Criteria

- [ ] “Generate story” (or equivalent) control exists in agent detail view and/or on event feed items.
- [ ] One click sends one Groq request with agent profile and optional event context; response is displayed.
- [ ] API key is read from env (e.g. VITE_GROQ_API_KEY) or user input; not hardcoded in source.
- [ ] Loading state is shown during the request; error state is shown on failure with a clear message.
- [ ] README (or docs) states that Groq API key is needed for the narrative feature and how to set it.
- [ ] If API key is missing, show a message like “Set VITE_GROQ_API_KEY to enable stories” instead of making a request.
- [ ] 429 (rate limit) is handled with a user-friendly message; no crash.

## Edge Cases

- **Missing API key**: Do not call API; show “Set API key to enable” (or similar).
- **Network timeout**: Treat as error; show “Request failed. Try again.”
- **Empty or invalid API response**: Show “No story generated” or fallback message.
- **User triggers multiple times quickly**: Optional cooldown or disable button until first request completes to avoid rate limits.
- **Very long response**: Truncate or scroll; max_tokens in request can cap length (e.g. 500 tokens).
- **Agent has minimal profile**: Prompt still includes whatever fields exist; narrative may be shorter or generic.

## Non-Functional Requirements

- **Security**: API key never committed to repo; env or runtime input only.
- **Performance**: Narrative request does not block the simulation or other UI; run async.
- **Cost**: One request per user click; no background or automatic calls.
