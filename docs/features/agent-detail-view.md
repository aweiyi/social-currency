# Feature Requirement Document: Agent Detail View

## Feature Name

Agent Detail View

## Goal

When the user selects an agent (from the grid or a list), show a detail view with that agent’s profile (name, emoji, background, personality, skills, needs, economic style), current token and fiat state, recent transactions involving them, and market price over time (if history is available).

## User Story

As a user exploring the FavourNet simulation, I want to click on an agent and see their full profile, balance, and activity so that I can understand how one person participates in the social token economy.

## Functional Requirements

1. **Selection** — User can select an agent by clicking a card in the agent grid or a row in an agent list. Selected agent ID is stored (e.g. in app state or Zustand).
2. **Detail panel or page** — A dedicated view (panel, drawer, or full page) shows when an agent is selected. It displays:
   - **Profile**: name, emoji, age, background, personality (e.g. openness, reliability, generosity, risk_tolerance, social_drive), economic_style, fiatPreference.
   - **Skills**: list of skill categories where the agent has non-zero skill, with level or label (from SKILL_CATEGORIES).
   - **Needs tendency**: list of categories they frequently need (from needs_tendency).
   - **Token state**: issued, redeemed, held (count or list), weeklyCapacity, remainingCapacity.
   - **Fiat balance**: current fiatBalance.
   - **Market price**: current marketPrice; optional mini-chart of marketPrice over time if the store keeps per-agent price history.
3. **Recent transactions** — List of recent transactions where the agent is `from` or `to` (e.g. last 20), with type, counterparty, category, amount, payment method, tick. Newest first.
4. **Close / back** — User can close the detail view or go back to the main view (e.g. button or click outside); selection is cleared.
5. **Data source** — All data read from Zustand store (agents, transactions). No new API or backend.

## Data Requirements

- **Reuse**: Store agents (full agent object by id), transactions (filter by from/to), optional history for agent price over time. SKILL_CATEGORIES for skill/need labels.
- **No new tables**: Only derived views (filter transactions by agent id; optionally slice price history by agent).

## User Flow

1. User sees the agent grid (or list) and clicks one agent.
2. Detail view opens showing that agent’s profile, skills, needs, economic style, token and fiat state, and market price.
3. User scrolls to see recent transactions involving this agent.
4. If store has price history per agent, user sees a small line chart of market price over ticks.
5. User clicks “Back” or “Close” (or outside) → detail view closes, selection cleared, main view visible again.
6. User can select a different agent and see their detail.

## Acceptance Criteria

- [ ] Clicking an agent opens a detail view; the correct agent’s data is shown.
- [ ] Profile section shows name, emoji, background, personality, economic_style, fiatPreference.
- [ ] Skills and needs are listed with readable labels (from SKILL_CATEGORIES).
- [ ] Token state (issued, redeemed, held, capacity) and fiat balance are shown and match the store.
- [ ] Recent transactions (this agent as from or to) are listed; at least last 20; newest first.
- [ ] Market price is shown; if per-agent price history exists in store, a small time-series chart is shown.
- [ ] User can close the detail view and return to the main view; selecting another agent updates the detail to that agent.
- [ ] If the selected agent is removed or invalid (e.g. after reset), detail view closes or shows a safe fallback (e.g. “Agent not found”).

## Edge Cases

- **Agent has no transactions**: “Recent transactions” shows empty list or “No transactions yet”.
- **Agent is inactive (defaulted)**: Profile still shows; token state may show issued vs redeemed; indicate “Inactive” or “Defaulted” if applicable.
- **Price history missing**: Only current market price is shown; no chart or “No history” message.
- **Rapid selection**: Selecting another agent while detail is open updates the view to the new agent without flicker or stale data.
- **Reset during detail view**: After reset, selected agent id may still exist (same seed); if store is reinitialised and agent list is same, detail can stay open and refresh from new state; otherwise close or show “not found”.

## Non-Functional Requirements

- **Performance**: Detail view renders quickly; transaction list is limited (e.g. 20) so no need for virtualisation.
- **Clarity**: Labels and layout make it easy to distinguish profile vs balance vs transactions.
