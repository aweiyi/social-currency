/**
 * Zustand store for FavourNet simulation.
 * Holds agents, transactions, tokens, pool, events, tick; runs simulateTick; keeps history for charts.
 */

import { create } from "zustand";
import seedAgents from "../data/seedAgents.json";
import { createPool } from "../engine/pool.js";
import { simulateTick } from "../engine/simulation.js";

const HISTORY_CAP = 200;
const DEFAULT_SPEED = 1; // 1 tick per second
const TOP_AGENTS_COUNT = 5;
const MAIN_CATEGORIES = ["software_dev", "design_creative", "writing_content", "cooking_food", "handyman_repair"];

/**
 * Deep clone agents from seed (no mutation of seed file).
 */
function getInitialAgents() {
  return seedAgents.map((a) => ({
    ...a,
    personality: { ...a.personality },
    skills: { ...a.skills },
    needs_tendency: { ...a.needs_tendency },
    reputation: { ...a.reputation, byCategory: { ...(a.reputation?.byCategory ?? {}) } },
    tokens: {
      ...a.tokens,
      held: [...(a.tokens?.held ?? [])],
    },
  }));
}

/**
 * Gini coefficient (0 = equality, 1 = max inequality).
 * values: array of non-negative numbers (e.g. wealth per agent).
 */
export function computeGini(values) {
  const arr = values.filter((v) => typeof v === "number" && v >= 0);
  if (arr.length === 0) return 0;
  arr.sort((a, b) => a - b);
  const n = arr.length;
  const sum = arr.reduce((s, x) => s + x, 0);
  if (sum === 0) return 0;
  let weightedSum = 0;
  for (let i = 0; i < n; i++) {
    weightedSum += (2 * (i + 1) - n - 1) * arr[i];
  }
  return weightedSum / (n * sum);
}

export const useSimStore = create((set, get) => {
  const initialPool = createPool();
  return {
    // Core state
    agents: getInitialAgents(),
    transactions: [],
    tokens: [],
    pool: initialPool,
    events: [],
    tick: 0,
    nextTokenId: 1,
    nextTxId: 1,
    selectedAgentId: null,

    // Control
    isRunning: false,
    speed: DEFAULT_SPEED,
    _intervalId: null,

    // History for charting (capped at HISTORY_CAP)
    priceHistory: [],
    circulationHistory: [],
    poolHistory: [],
    giniHistory: [],
    socialPremiumHistory: [],
    dualCurrencyHistory: [],
    categoryStats: {}, // volumes for heatmap { categoryId: { token: X, fiat: Y } }

    runTick() {
      const state = get();
      const input = {
        agents: state.agents,
        tokens: state.tokens,
        transactions: state.transactions,
        pool: state.pool,
        tick: state.tick,
        nextTokenId: state.nextTokenId,
        nextTxId: state.nextTxId,
      };
      const { state: nextState, events: tickEvents } = simulateTick(input);

      // Append notable events (simulation already returns only notable)
      const newEvents = [...state.events, ...tickEvents].slice(-100);

      // 1. Price History for ALL agents
      const priceEntry = { tick: nextState.tick };
      nextState.agents.forEach(a => {
        priceEntry[a.id] = a.marketPrice;
      });
      const priceHistory = [...state.priceHistory, priceEntry].slice(-HISTORY_CAP);

      // 2. Circulation by category
      const circEntry = { tick: nextState.tick };
      MAIN_CATEGORIES.forEach(cat => {
        circEntry[cat] = nextState.transactions
          .filter(t => t.tick === nextState.tick && t.type === "exchange" && t.category === cat)
          .reduce((sum, t) => sum + (t.tokenAmount || (t.fiatAmount ? t.fiatAmount / 50 : 0)), 0);
      });
      const circulationHistory = [...state.circulationHistory, circEntry].slice(-HISTORY_CAP);

      // 3. Pool History with categories
      const poolEntry = {
        tick: nextState.tick,
        healthScore: nextState.pool.healthScore,
        totalCapacity: nextState.pool.totalCapacity
      };
      Object.entries(nextState.pool.byCategory || {}).forEach(([cat, cap]) => {
        poolEntry[cat] = cap;
      });
      const poolHistory = [...state.poolHistory, poolEntry].slice(-HISTORY_CAP);

      // 4. Gini History
      const giniToken = getTokenGini(nextState.agents, nextState.tokens);
      const giniFiat = computeGini(nextState.agents.filter((a) => a.isActive).map((a) => a.fiatBalance ?? 0));
      const giniHistory = [...state.giniHistory, { tick: nextState.tick, tokenGini: giniToken, fiatGini: giniFiat }].slice(-HISTORY_CAP);

      // 5. Social Premium History
      const metrics = selectDualCurrencyMetrics(nextState.transactions);
      const socialPremiumHistory = [...state.socialPremiumHistory, { tick: nextState.tick, value: metrics.socialPremium }].slice(-HISTORY_CAP);

      // 6. Dual Currency History
      const lastTickExchanges = nextState.transactions.filter(t => t.tick === nextState.tick && t.type === "exchange");
      const dualEntry = {
        tick: nextState.tick,
        token: lastTickExchanges.filter(t => t.paymentMethod === "social_token").length,
        fiat: lastTickExchanges.filter(t => t.paymentMethod === "fiat").length
      };
      const dualCurrencyHistory = [...state.dualCurrencyHistory, dualEntry].slice(-HISTORY_CAP);

      // 7. Category Stats for Heatmap (cumulative volume)
      const nextCategoryStats = { ...state.categoryStats };
      lastTickExchanges.forEach(tx => {
        if (!nextCategoryStats[tx.category]) nextCategoryStats[tx.category] = { token: 0, fiat: 0 };
        if (tx.paymentMethod === "social_token") {
          nextCategoryStats[tx.category].token += tx.tokenAmount || 0;
        } else {
          nextCategoryStats[tx.category].fiat += tx.fiatAmount || 0;
        }
      });

      set({
        agents: nextState.agents,
        transactions: nextState.transactions,
        tokens: nextState.tokens,
        pool: nextState.pool,
        tick: nextState.tick,
        nextTokenId: nextState.nextTokenId,
        nextTxId: nextState.nextTxId,
        events: newEvents,
        priceHistory,
        circulationHistory,
        poolHistory,
        giniHistory,
        socialPremiumHistory,
        dualCurrencyHistory,
        categoryStats: nextCategoryStats,
      });
    },

    toggleRunning() {
      const { isRunning, _intervalId, runTick, speed } = get();
      if (_intervalId) clearInterval(_intervalId);
      if (isRunning) {
        set({ isRunning: false, _intervalId: null });
        return;
      }
      const ms = Math.max(100, 1000 / speed);
      const id = setInterval(runTick, ms);
      set({ isRunning: true, _intervalId: id });
    },

    setSpeed(speed) {
      const { _intervalId, isRunning, runTick } = get();
      if (_intervalId) clearInterval(_intervalId);
      let id = null;
      if (isRunning) {
        const ms = Math.max(100, 1000 / Math.max(0.1, speed));
        id = setInterval(runTick, ms);
      }
      set({ speed: Math.max(0.1, speed), _intervalId: id });
    },

    reset() {
      const { _intervalId } = get();
      if (_intervalId) clearInterval(_intervalId);
      set({
        agents: getInitialAgents(),
        transactions: [],
        tokens: [],
        pool: createPool(),
        events: [],
        tick: 0,
        nextTokenId: 1,
        nextTxId: 1,
        isRunning: false,
        _intervalId: null,
        priceHistory: [],
        circulationHistory: [],
        poolHistory: [],
        giniHistory: [],
        socialPremiumHistory: [],
        dualCurrencyHistory: [],
        categoryStats: {},
        selectedAgentId: null,
      });
    },

    setSelectedAgentId(id) {
      const current = get().selectedAgentId;
      set({ selectedAgentId: current === id ? null : id });
    },

    triggerDefault(id) {
      const state = get();
      const agents = state.agents.map(a => a.id === id ? { ...a, isActive: false } : a);
      const events = [...state.events, {
        type: "default",
        tick: state.tick,
        agentId: id,
        name: agents.find(a => a.id === id)?.name || "Unknown",
        message: `MANUAL OVERRIDE: ${agents.find(a => a.id === id)?.name || "Agent"} was forced into default.`
      }].slice(-100);
      set({ agents, events });
    }
  };
});

/**
 * Token Gini: inequality of token value held (amount * currentPrice per token).
 */
function getTokenGini(agents, tokens) {
  const valueByAgent = new Map();
  for (const a of agents) {
    valueByAgent.set(a.id, 0);
  }
  for (const t of tokens) {
    if (t.status !== "active") continue;
    const val = (t.amount ?? 0) * (t.currentPrice ?? 0);
    valueByAgent.set(t.holder, (valueByAgent.get(t.holder) ?? 0) + val);
  }
  return computeGini([...valueByAgent.values()]);
}

/**
 * Selectors for dual-currency metrics (can be used in components).
 */
export function selectDualCurrencyMetrics(transactions) {
  let tokenExchangeCount = 0;
  let fiatExchangeCount = 0;
  let totalTokenValue = 0;
  let totalFiatValue = 0;
  let totalFiatEquivalentForTokenTx = 0;
  for (const tx of transactions) {
    if (tx.type !== "exchange") continue;
    if (tx.paymentMethod === "social_token") {
      tokenExchangeCount += 1;
      totalTokenValue += tx.tokenValue ?? tx.tokenAmount ?? 0;
      totalFiatEquivalentForTokenTx += tx.fiatEquivalent ?? 0;
    } else {
      fiatExchangeCount += 1;
      totalFiatValue += tx.fiatAmount ?? 0;
    }
  }
  const socialPremium = totalFiatEquivalentForTokenTx > 0 ? totalTokenValue / totalFiatEquivalentForTokenTx : 0;
  return {
    tokenExchangeCount,
    fiatExchangeCount,
    totalTokenValue,
    totalFiatValue,
    totalFiatEquivalentForTokenTx,
    socialPremium,
  };
}
