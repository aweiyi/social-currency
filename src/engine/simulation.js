/**
 * Pure simulation tick: needs → match → payment decision → issue/fiat → redemptions → defaults → prices → events.
 * One tick ≈ one simulated day. ~15–20% of agents generate a need per tick (~27–36 exchanges).
 */

import { SKILL_CATEGORIES } from "../data/categories.js";
import { calculateMarketPrice } from "./pricing.js";
import { addLevy, createPool, getDefaultedTokenIds, attemptAbsorption, computeHealthScore } from "./pool.js";
import { decidePaymentMethod } from "./payment.js";

const NEED_PROBABILITY = 0.175; // ~15–20% of agents get a need per tick
const DEFAULT_PROBABILITY = 0.02; // 2% chance per agent to go inactive each tick
const REDEMPTION_PROBABILITY_BASE = 0.08; // base chance per held token to be redeemed this tick
const LARGE_TRADE_HOURS = 2.0; // trades >= this are "large" for events
const PRICE_SWING_THRESHOLD = 0.1; // 10% price change = notable

/**
 * Deep clone an agent (so we don't mutate the original).
 */
function cloneAgent(agent) {
  return {
    ...agent,
    personality: { ...agent.personality },
    skills: { ...agent.skills },
    needs_tendency: { ...agent.needs_tendency },
    reputation: { ...agent.reputation, byCategory: { ...(agent.reputation?.byCategory ?? {}) } },
    tokens: {
      ...agent.tokens,
      held: [...(agent.tokens?.held ?? [])],
    },
  };
}

/**
 * Pick a category from needs_tendency (weighted random).
 */
function pickNeedCategory(agent, random) {
  const tendency = agent.needs_tendency ?? {};
  const keys = Object.keys(tendency).filter((k) => tendency[k] > 0);
  if (keys.length === 0) return null;
  const total = keys.reduce((s, k) => s + tendency[k], 0);
  let r = random() * total;
  for (const k of keys) {
    r -= tendency[k];
    if (r <= 0) return k;
  }
  return keys[keys.length - 1];
}

/**
 * Find best provider for a category: active, has capacity, has skill in category, highest reputation in that category.
 */
function findProvider(agents, category, excludeId, random) {
  const candidates = agents.filter(
    (a) =>
      a.isActive &&
      a.id !== excludeId &&
      (a.skills?.[category] ?? 0) > 0.3 &&
      (a.tokens?.remainingCapacity ?? 0) >= 0.5
  );
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => (b.reputation?.overall ?? 0) - (a.reputation?.overall ?? 0));
  const top = candidates[0].reputation?.overall ?? 0;
  const ties = candidates.filter((a) => (a.reputation?.overall ?? 0) === top);
  return ties[Math.floor(random() * ties.length)];
}

/**
 * Run one simulation tick. Pure: returns new state and events; does not mutate input.
 * @param {Object} state - { agents, tokens, transactions, pool, tick, nextTokenId?, nextTxId? }
 * @param {{ (): number }?} random - Optional RNG (default Math.random)
 * @returns {{ state: Object, events: Object[] }}
 */
export function simulateTick(state, random = Math.random) {
  const nextTokenId = state.nextTokenId ?? 1;
  const nextTxId = state.nextTxId ?? 1;
  let tokens = [...(state.tokens ?? [])];
  let transactions = [...(state.transactions ?? [])];
  let pool = state.pool ? { ...state.pool, byCategory: { ...state.pool.byCategory } } : createPool();
  const events = [];
  const agentById = new Map();
  const agents = (state.agents ?? []).map((a) => {
    const c = cloneAgent(a);
    agentById.set(c.id, c);
    return c;
  });
  const activeAgents = agents.filter((a) => a.isActive);
  const prevPrices = new Map(agents.map((a) => [a.id, a.marketPrice]));

  // --- 1. Generate needs and run exchanges (~15–20% of agents) ---
  const needers = activeAgents.filter(() => random() < NEED_PROBABILITY);
  let txCounter = state.nextTxId ?? 1;
  let tokCounter = state.nextTokenId ?? 1;

  for (const requester of needers) {
    const category = pickNeedCategory(requester, random);
    if (!category || !SKILL_CATEGORIES[category]) continue;
    const provider = findProvider(agents, category, requester.id, random);
    if (!provider) continue;

    const hours = 0.5 + random() * 2.5; // 0.5–3.0
    const decision = decidePaymentMethod(requester, provider, category, hours, SKILL_CATEGORIES);
    const fiatCost = decision.fiatEquivalent ?? hours * (SKILL_CATEGORIES[category]?.fiatEquivalent ?? 30);

    if (decision.method === "fiat") {
      if (requester.fiatBalance < decision.amount) continue;
      requester.fiatBalance -= decision.amount;
      provider.fiatBalance += decision.amount;
      const tx = {
        id: `tx_${String(txCounter++).padStart(4, "0")}`,
        tick: state.tick + 1,
        type: "exchange",
        paymentMethod: "fiat",
        from: requester.id,
        to: provider.id,
        category,
        hours,
        tokenAmount: null,
        fiatAmount: decision.amount,
        fiatEquivalent: decision.amount,
        poolLevy: 0,
        socialPremium: null,
      };
      transactions.push(tx);
      if (hours >= LARGE_TRADE_HOURS) {
        events.push({
          type: "large_trade",
          tick: state.tick + 1,
          from: requester.id,
          to: provider.id,
          hours,
          method: "fiat",
          message: `${requester.name} paid $${decision.amount.toFixed(0)} to ${provider.name} for ${hours.toFixed(1)}h of ${category}.`
        });
      }
      continue;
    }

    // Social token
    if (requester.tokens.remainingCapacity < hours) continue;
    const levy = hours * 0.1;
    pool = addLevy(pool, hours, category);
    const priceAtIssuance = requester.marketPrice ?? 0.5;
    const tokenId = `tok_${String(tokCounter++).padStart(4, "0")}`;
    const token = {
      id: tokenId,
      issuer: requester.id,
      holder: provider.id,
      category,
      amount: hours,
      issuedAt: state.tick + 1,
      status: "active",
      priceAtIssuance,
      currentPrice: priceAtIssuance,
    };
    tokens.push(token);
    requester.tokens.issued += hours;
    requester.tokens.remainingCapacity -= hours;
    if (!provider.tokens.held) provider.tokens.held = [];
    provider.tokens.held.push(tokenId);
    const tokenValue = hours * priceAtIssuance;
    const tx = {
      id: `tx_${String(txCounter++).padStart(4, "0")}`,
      tick: state.tick + 1,
      type: "exchange",
      paymentMethod: "social_token",
      from: requester.id,
      to: provider.id,
      category,
      hours,
      tokenAmount: hours,
      fiatAmount: null,
      fiatEquivalent: fiatCost,
      poolLevy: levy,
      socialPremium: (fiatCost && tokenValue / fiatCost) || null,
      tokenValue,
    };
    transactions.push(tx);
    if (hours >= LARGE_TRADE_HOURS) {
      events.push({
        type: "large_trade",
        tick: state.tick + 1,
        from: requester.id,
        to: provider.id,
        hours,
        method: "social_token",
        message: `${provider.name} accepted ${hours.toFixed(1)}h of ${requester.name}'s tokens for ${category}.`
      });
    }
  }

  // --- 2. Process redemptions (held tokens, probability by issuer redemptionSpeed) ---
  for (const agent of agents) {
    const held = agent.tokens?.held ?? [];
    const toRemove = [];
    for (const tid of held) {
      const token = tokens.find((t) => t.id === tid && t.status === "active");
      if (!token) continue;
      const issuer = agentById.get(token.issuer);
      const speed = issuer?.redemptionSpeed ?? 0.5;
      if (random() < REDEMPTION_PROBABILITY_BASE * speed) {
        token.status = "redeemed";
        issuer.tokens.redeemed = (issuer.tokens.redeemed ?? 0) + token.amount;
        toRemove.push(tid);
        transactions.push({
          id: `tx_${String(txCounter++).padStart(4, "0")}`,
          tick: state.tick + 1,
          type: "redemption",
          paymentMethod: "social_token",
          from: token.issuer,
          to: agent.id,
          category: token.category,
          hours: token.amount,
          tokenAmount: token.amount,
          fiatAmount: null,
          fiatEquivalent: token.amount * (SKILL_CATEGORIES[token.category]?.fiatEquivalent ?? 30),
          poolLevy: 0,
          socialPremium: null,
        });
      }
    }
    agent.tokens.held = agent.tokens.held.filter((id) => !toRemove.includes(id));
  }

  // --- 3. Defaults: 2% chance per agent to go inactive ---
  for (const agent of activeAgents) {
    if (random() >= DEFAULT_PROBABILITY) continue;
    agent.isActive = false;
    const defaultedIds = getDefaultedTokenIds(agent.id, tokens);
    const affectedHolders = new Set();
    let totalDebt = 0;

    for (const tid of defaultedIds) {
      const token = tokens.find((t) => t.id === tid);
      if (token) {
        affectedHolders.add(token.holder);
        totalDebt += token.amount;
      }
    }

    events.push({
      type: "default",
      tick: state.tick + 1,
      agentId: agent.id,
      name: agent.name,
      tokenCount: defaultedIds.length,
      totalDebt,
      affectedHolders: affectedHolders.size,
      message: `CRITICAL: ${agent.name} has defaulted! ${defaultedIds.length} tokens ($${totalDebt.toFixed(1)}h) across ${affectedHolders.size} holders are now at risk.`
    });

    for (const tid of defaultedIds) {
      const token = tokens.find((t) => t.id === tid);
      if (!token) continue;
      token.status = "defaulted";
      const result = attemptAbsorption(token, null, pool);
      pool = result.pool;

      if (result.tokenStatus === "pooled") {
        token.status = "pooled";
        events.push({
          type: "pool_claim",
          tick: state.tick + 1,
          tokenId: tid,
          category: token.category,
          amount: token.amount,
          issuerName: agent.name,
          reason: result.reason,
          message: `Pool absorbed ${token.amount.toFixed(1)}h of ${agent.name}'s ${token.category} debt.`
        });
      }
    }
    transactions.push({
      id: `tx_${String(txCounter++).padStart(4, "0")}`,
      tick: state.tick + 1,
      type: "default",
      paymentMethod: null,
      from: agent.id,
      to: null,
      category: null,
      hours: 0,
      tokenAmount: null,
      fiatAmount: null,
      fiatEquivalent: null,
      poolLevy: null,
      socialPremium: null,
    });
  }

  // --- 4. Recalculate market prices for all agents ---
  for (const agent of agents) {
    agent.marketPrice = Math.max(0, Math.min(1, calculateMarketPrice(agent, agents)));
  }
  for (const token of tokens) {
    const issuer = agentById.get(token.issuer);
    if (issuer) token.currentPrice = issuer.marketPrice;
  }

  // --- 5. Pool health ---
  const outstanding = tokens.filter((t) => t.status === "active").reduce((s, t) => s + t.amount, 0);
  pool.healthScore = computeHealthScore(pool, outstanding);

  // --- 6. Notable events: price swings > 10% ---
  for (const agent of agents) {
    const prev = prevPrices.get(agent.id);
    if (prev != null && prev > 0) {
      const change = (agent.marketPrice - prev) / prev;
      if (Math.abs(change) >= PRICE_SWING_THRESHOLD) {
        events.push({
          type: "price_swing",
          tick: state.tick + 1,
          agentId: agent.id,
          name: agent.name,
          previousPrice: prev,
          newPrice: agent.marketPrice,
          changePercent: change * 100,
          message: `${agent.name}'s token price ${change > 0 ? 'surged' : 'dropped'} by ${(Math.abs(change) * 100).toFixed(1)}% to ${agent.marketPrice.toFixed(2)}.`
        });
      }
    }
  }

  const newTick = state.tick + 1;
  const newState = {
    agents,
    tokens: tokens.slice(-1000),
    transactions: transactions.slice(-500),
    pool,
    tick: newTick,
    nextTokenId: tokCounter,
    nextTxId: txCounter,
  };

  return { state: newState, events };
}
