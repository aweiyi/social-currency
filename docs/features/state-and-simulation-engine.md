# Feature Requirement Document: State Management and Simulation Engine

## Feature Name

State Management and Simulation Engine

## Goal

Provide a single source of truth for the FavourNet simulation (agents, transactions, tokens, community pool, tick) and a pure-JS simulation engine that advances the economy one tick at a time. The app can read from the store and display data (e.g. first 12 agents); no play/pause UI is required in this feature—only the ability to run the loop programmatically.

## User Story

As a developer (or future control-panel user), I want the simulation state to live in a Zustand store and the simulation loop to be implemented in pure JavaScript, so that the UI can subscribe to state and the simulation can be advanced on demand or on an interval.

## Functional Requirements

1. **Zustand store** exposes: `agents` (array), `transactions` (array), `tokens` (array), `pool` (object), `events` (array, notable only), `tick` (number), and history arrays: `priceHistory[]`, `circulationHistory[]`, `poolHistory[]`, `giniHistory[]` (capped at 200 ticks). Control: `isRunning`, `speed`; actions: `runTick()`, `toggleRunning()`, `setSpeed()`, `reset()`.
2. **Initial state** is loaded from `src/data/seedAgents.json` (import seedAgents); agents are copied into the store (no mutation of seed file). Pool is initialised with zero capacity; transactions and tokens start empty; tick starts at 0.
3. **Skill categories**: Use the 16 categories in `src/data/categories.js` (label, emoji, domain, description, avgDuration, fiatEquivalent).
4. **Engine modules (pure functions)**:
   - **pricing.js**: `calculateMarketPrice(agent, allAgents)` — reputation(0.4) + inverseObligationRatio(0.25) + velocity(0.2) + scarcity(0.15); `calculateCategoryScarcity(agent, allAgents)`.
   - **pool.js**: Pool state (totalCapacity, byCategory, healthScore); `addLevy(amount, category)` (10%); `processDefault` / `getDefaultedTokenIds`; `attemptAbsorption(token, volunteer, pool)`.
   - **payment.js**: `decidePaymentMethod(requester, provider, category, hours, skillCategories)` → `social_token` or `fiat`.
   - **simulation.js**: `simulateTick(state, random?)` — generate needs (~15–20% of agents, ~27–36 exchanges/tick), match, decide payment, issue tokens (0.5–3.0 hours, 10% levy) or fiat transfer, process redemptions, 2% chance per agent inactive (defaults + pool absorption), recalc prices; returns `{ state, events }`. Events are **notable only**: defaults, large trades, price swings >10%, pool claims.
5. **Dual currency**: Each agent has `fiatBalance` (start 1000) and `fiatPreference` (0–1). Fiat transactions deduct from requester and add to provider. Track per-tick / cumulative: tokenExchangeCount, fiatExchangeCount, totalTokenValue, totalFiatValue, socialPremium (= totalTokenValue / totalFiatEquivalent for token tx), tokenGini, fiatGini.
6. **Data models** match PROJECT_PLAN_V2_CURSOR.md: Agent (v2), Transaction (v2), Token (v2), Community Pool (v2).
7. **History caps**: Transactions/tokens capped (e.g. 500 / 1000); history arrays capped at 200 ticks.
8. **Id generation**: New transactions and tokens receive unique IDs (e.g. `tx_0001`, `tok_0001`) via store counters.

## Data Requirements

- **Reuse**: `agents` from seed data; `SKILL_CATEGORIES` from `src/data/categories.js` (fiatEquivalent, avgDuration, etc.).
- **New in store**: `transactions[]`, `tokens[]`, `pool{}`, `tick`, optionally `events[]` or `history{}` for dashboard.
- **Pool shape**: `totalCapacity`, `byCategory` (keyed by skill category id), `claimsProcessed`, `claimsPending`, `healthScore`.
- **Token shape**: `id`, `issuer`, `holder`, `category`, `amount`, `issuedAt`, `status`, `priceAtIssuance`, `currentPrice`.
- **Transaction shape**: `id`, `tick`, `type`, `paymentMethod`, `from`, `to`, `category`, `hours`, `tokenAmount`, `fiatAmount`, `fiatEquivalent`, `poolLevy`, `socialPremium` (optional).

## User Flow

1. App loads → store initialises from seed agents and empty transactions/tokens/pool, tick 0.
2. (Future) User clicks “Play” or “Next tick” → something calls the store’s advance action → engine runs one tick, store updates.
3. React components read from the store (e.g. `useStore(s => s.agents)`) and render; e.g. existing App grid shows first 12 agents from store instead of static import.

For this feature, flow 2 may be “developer calls advance from console or a temporary button” — no formal control panel required yet.

## Acceptance Criteria

- [ ] Zustand store exists with agents, transactions, tokens, pool, tick (and optional history).
- [ ] Initial state: agents from seedAgents.json, pool zeroed, transactions/tokens empty, tick 0.
- [ ] One call to the store’s “run one tick” action runs the full loop (needs → match → pay → issue/fiat → redemptions → defaults → prices → reputation → pool).
- [ ] After N ticks, transactions and tokens arrays contain N batches of new entries; agent fields (tokens.issued, tokens.held, fiatBalance, marketPrice, reputation) and pool fields update correctly.
- [ ] Data structures match the v2 data model (Agent, Transaction, Token, Pool) from the project plan.
- [ ] App (or a minimal test) can render agents from the store; no requirement to show transactions in UI yet.
- [ ] History/transaction/token arrays are capped to prevent unbounded growth (e.g. last 200 ticks for history, or last 500 transactions).

## Edge Cases

- **No provider found** for a need: skip that exchange for the tick; do not create a transaction.
- **Agent has zero remaining capacity**: exclude from matching as provider.
- **Fiat balance insufficient** for a fiat exchange: treat as “no match” or skip (define in engine).
- **All agents inactive**: tick can still run (no needs, no exchanges); pool and defaults still process.
- **Division by zero** in price/reputation formulas: guard with `Math.max(x, 1)` or similar where denominators are used.
- **Category key mismatch**: use only category keys that exist in `SKILL_CATEGORIES`; invalid category skips the exchange.

## Non-Functional Requirements

- **Performance**: One tick for 180 agents completes in &lt; 100 ms in the browser (O(n²) matching is acceptable).
- **Determinism**: For the same seed and same tick count, running the same number of ticks should produce the same state (use seeded RNG if randomness is required for reproducibility).
- **Testability**: Engine logic should be callable with a given state and return next state or mutations without depending on React or DOM.
