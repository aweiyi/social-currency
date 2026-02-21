# Feature Requirement Document: Dashboard and Charts

## Feature Name

Dashboard and Charts

## Goal

Provide a dashboard that visualises the FavourNet economy using Recharts: token circulation, pool health, Gini coefficient, agent prices (e.g. top 10 by volume), dual-currency metrics (token vs fiat ratio, category payment preferences, Social Premium), and a filtered event feed. Any list of 180 agents must use virtualisation or pagination to avoid rendering all at once.

## User Story

As a user running the FavourNet simulation, I want to see charts and metrics for token circulation, pool health, inequality (Gini), agent prices, token vs fiat usage, and notable events, so that I can understand how the social token economy behaves over time.

## Functional Requirements

1. **Token circulation** — A chart (e.g. line or area) showing total token circulation (or volume) over time (tick). Data comes from store history (capped at last 200 ticks).
2. **Pool health** — A visualisation of pool health (e.g. gauge, bar, or number with colour: green &gt; 0.8, yellow 0.5–0.8, red &lt; 0.5). Uses pool.healthScore from the store.
3. **Gini coefficient** — Display of current Gini coefficient for token holdings (and optionally fiat). Value computed from store (agents’ token holdings or fiat balances).
4. **Agent prices** — A chart showing market price over time for a limited set of agents (e.g. top 10 by volume or by issuance) to keep the chart readable; not 180 lines.
5. **Token vs Fiat ratio** — A pie or bar chart showing the proportion of exchanges (or value) done via social tokens vs fiat over a recent window (e.g. last 50 ticks or all time).
6. **Category payment preferences** — A heatmap or bar chart showing which skill categories tend to be paid in tokens vs fiat (e.g. per-category token %).
7. **Social Premium** — Display of the metric: (total value exchanged via tokens) / (fiat equivalent of same exchanges). Value &gt; 1.0 means tokens generate more value than fiat equivalent.
8. **Event feed** — A list or log of “notable” events: defaults, pool claims, price swings &gt; 10%, large trades. Events are pushed by the simulation engine or derived from transactions; feed is capped (e.g. last 50 events) and newest first.
9. **Agent list (if any)** — If the dashboard or app shows a list of all agents, it must use virtualisation (e.g. react-window) or pagination so that only a subset (e.g. 20) is rendered at a time.
10. **Data source** — All metrics and charts read from the Zustand store (and optional history); no separate API.

## Data Requirements

- **Reuse**: Store state (agents, transactions, tokens, pool, tick, history). SKILL_CATEGORIES for category labels.
- **Derived**: Gini from agent token holdings; token vs fiat ratio from transactions (paymentMethod); Social Premium from transactions (token value vs fiatEquivalent); category breakdown from transactions by category; notable events from transaction types and filters.
- **History**: Store must expose (or already expose) time-series for circulation, pool health, and optionally per-agent price for top N agents (see state-and-simulation-engine FRED). If not present, dashboard may compute from transactions for “so far” view.

## User Flow

1. User has the simulation running (or paused at some tick) and views the dashboard.
2. User sees token circulation over time, pool health, Gini, and agent price chart (top 10).
3. User sees token vs fiat ratio and category payment preferences.
4. User sees Social Premium and event feed.
5. If user scrolls an agent list, only visible rows render (virtualisation) or user paginates (e.g. next 20 agents).

## Acceptance Criteria

- [ ] Token circulation chart renders and updates as the simulation advances (or shows history up to current tick).
- [ ] Pool health is shown with correct colour bands (green/yellow/red) based on healthScore.
- [ ] Gini coefficient is displayed and computed from current agent token holdings (or defined subset).
- [ ] Agent price chart shows at most 10 agents (e.g. top by volume) and does not plot 180 lines.
- [ ] Token vs fiat ratio chart (pie or bar) reflects payment method from transactions.
- [ ] Category payment preferences (heatmap or bars) show which categories are token vs fiat heavy.
- [ ] Social Premium is displayed and formula matches project plan.
- [ ] Event feed shows notable events only (defaults, pool, big price moves, large trades); capped list; newest first.
- [ ] Any list of 180 agents uses virtualisation or pagination; no “render all 180” in the DOM at once.
- [ ] Dashboard is readable and laid out in a single view or logical tabs/sections.

## Edge Cases

- **No transactions yet**: Charts show empty or zero; no crashes. Gini can be 0 or “N/A”; Social Premium can be 0 or “N/A”.
- **All fiat or all token**: Pie chart shows 100% one side; ratio is still correct.
- **Pool health NaN or negative**: Display as 0 or “N/A” and style as stressed (red).
- **Very long event feed**: Cap at 50 (or N) items; older events drop off.
- **History shorter than 200 ticks**: Charts show only available ticks.

## Non-Functional Requirements

- **Performance**: Dashboard and charts render without blocking the simulation; Recharts with 200 points and 10 lines is acceptable.
- **Accessibility**: Charts have titles or labels; colour is not the only differentiator for pool health (e.g. text or icon as well).
