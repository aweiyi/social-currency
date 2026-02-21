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

    // Control
    isRunning: false,
    speed: DEFAULT_SPEED,
    _intervalId: null,

    // History for charting (capped at HISTORY_CAP)
    priceHistory: [],
    circulationHistory: [],
    poolHistory: [],
    giniHistory: [],

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

      // History: one entry per tick
      const circulation = nextState.transactions
        .filter((t) => t.type === "exchange")
        .reduce((s, t) => s + (t.tokenAmount ?? 0) + (t.fiatAmount ? t.fiatAmount / 50 : 0), 0);
      const giniToken = getTokenGini(nextState.agents, nextState.tokens);
      const giniFiat = computeGini(nextState.agents.filter((a) => a.isActive).map((a) => a.fiatBalance ?? 0));

      const priceHistory = [...state.priceHistory, { tick: nextState.tick, prices: nextState.agents.slice(0, 10).map((a) => ({ id: a.id, price: a.marketPrice })) }].slice(-HISTORY_CAP);
      const circulationHistory = [...state.circulationHistory, { tick: nextState.tick, value: circulation }].slice(-HISTORY_CAP);
      const poolHistory = [...state.poolHistory, { tick: nextState.tick, healthScore: nextState.pool.healthScore, totalCapacity: nextState.pool.totalCapacity }].slice(-HISTORY_CAP);
      const giniHistory = [...state.giniHistory, { tick: nextState.tick, tokenGini: giniToken, fiatGini: giniFiat }].slice(-HISTORY_CAP);

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
      });
    },
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
