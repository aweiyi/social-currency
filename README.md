# FavourNet — Social Currency Simulation for Network School

A browser-based simulation showing how social tokens (favour-based currency) flow through a Network School community, what behaviours they incentivise, and how this functions alongside the fiat currency economy in Network School.

## Concept summary

FavourNet simulates a micro-economy inside Network School where members issue personal social tokens instead of (or alongside) money. Each token represents a promise of future value (a favour).

**Three core mechanisms:**

- **Proof of Contribution (PoC)** — Attestation system that builds reputation when favours are delivered.
- **Social Token Exchange** — Personal tokens issued, traded, and redeemed at market prices.
- **Community Insurance Pool** — Mutual fund that absorbs defaults when members can’t deliver.

The app uses a **hybrid approach**: 180 agent profiles are generated once (e.g. via LLM), then the simulation runs entirely **rule-based** in the browser—no API calls during the sim. An optional **narrative layer** can generate short stories on demand when you click an event or agent.

## Tech stack

- **Vite + React** — Fast dev setup, no backend.
- **Zustand** — State management (agents, transactions, pool, tick).
- **Recharts** — Dashboard charts.
- **Tailwind CSS** — Styling.

Everything runs in the browser; no server or database.

## Setup

```bash
npm install
npm run dev
```

Seed data (180 agents, 16 skill categories) lives in `src/data/`—no Groq or other API run is required to start the app.

**Other scripts:**

- `npm run build` — Production build.
- `npm run preview` — Preview production build locally.
- `npm run test` — Run tests once (Vitest).
- `npm run test:watch` — Run tests in watch mode.

## Project structure

- **`src/data/`** — `seedAgents.json` (180 agents), `categories.js` (skill categories and metadata).
- **`src/engine/`** — Pure simulation: `pricing.js`, `pool.js`, `payment.js`, `simulation.js`.
- **`src/store/useSimStore.js`** — Zustand store (agents, tick, runTick, reset, history).
- **`src/App.jsx`** — Main app (agent grid and future UI).
- **`src/**/*.test.js`** — Vitest tests for engine and store (run with `npm run test`).
- **`PROJECT_PLAN_V2_CURSOR.md`** — Full architecture, data models, simulation loop, and performance notes.

## Phases (roadmap)

| Phase | Description |
|-------|-------------|
| **1** | Documentation & README (this repo). |
| **2** | State management (Zustand) + simulation engine (pure JS loop). |
| **3** | Control panel — play/pause, speed, reset, tick display. |
| **4** | Dashboard & charts — token circulation, pool health, Gini, dual-currency metrics, event feed. |
| **5** | Agent detail view — profile, tokens, transactions, price history. |
| **6** (optional) | Narrative layer — on-demand Groq stories for events/agents. |

Feature specs (FREDs) live in **`docs/features/`** and are written before implementation for each phase.

## Testing

After `npm install`, run:

```bash
npm run test
```

Tests cover the **engine** (pricing, pool, payment, simulation) and the **store** (Gini, dual-currency metrics, `runTick`, `reset`). Use `npm run test:watch` during development.

## Further reading

See **[PROJECT_PLAN_V2_CURSOR.md](./PROJECT_PLAN_V2_CURSOR.md)** for:

- Technical architecture diagram
- Agent and transaction data models (v2)
- Simulation loop (generateNeeds → matchCounterparties → issueTokens → redemptions → defaults → prices → pool)
- Dual-currency decision logic and “Social Premium” metric
- Performance notes for 180 agents
