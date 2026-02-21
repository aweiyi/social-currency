import { describe, it, expect } from "vitest";
import { simulateTick } from "./simulation.js";
import { createPool } from "./pool.js";

function makeAgent(id, overrides = {}) {
  return {
    id,
    name: `Agent ${id}`,
    emoji: "👤",
    isActive: true,
    personality: { openness: 0.5, reliability: 0.7, generosity: 0.5, risk_tolerance: 0.3, social_drive: 0.6 },
    skills: { software_dev: 0.8, design_creative: 0, cooking_food: 0.3 },
    needs_tendency: { software_dev: 0, design_creative: 0.7, cooking_food: 0.5 },
    reputation: { overall: 0.7, byCategory: {} },
    tokens: { issued: 0, redeemed: 1, held: [], weeklyCapacity: 12, remainingCapacity: 12 },
    fiatBalance: 1000,
    marketPrice: 0.6,
    redemptionSpeed: 0.7,
    fiatPreference: 0.4,
    economic_style: "trader",
    ...overrides,
  };
}

describe("simulation", () => {
  it("returns state and events and does not mutate input", () => {
    const pool = createPool();
    const agents = [makeAgent("a1"), makeAgent("a2"), makeAgent("a3")];
    const state = {
      agents,
      tokens: [],
      transactions: [],
      pool,
      tick: 0,
      nextTokenId: 1,
      nextTxId: 1,
    };
    const before = JSON.stringify(state);
    const { state: next, events } = simulateTick(state);
    expect(next).toBeDefined();
    expect(Array.isArray(events)).toBe(true);
    expect(next.tick).toBe(1);
    expect(next.agents.length).toBe(3);
    expect(next.pool).toBeDefined();
    expect(JSON.stringify(state)).toBe(before);
  });

  it("increments tick and nextTxId/nextTokenId", () => {
    const state = {
      agents: [makeAgent("a1"), makeAgent("a2")],
      tokens: [],
      transactions: [],
      pool: createPool(),
      tick: 5,
      nextTokenId: 10,
      nextTxId: 20,
    };
    const { state: next } = simulateTick(state);
    expect(next.tick).toBe(6);
    expect(next.nextTxId).toBeGreaterThanOrEqual(20);
    expect(next.nextTokenId).toBeGreaterThanOrEqual(10);
  });

  it("with seeded RNG produces deterministic result for same seed", () => {
    const state = {
      agents: [makeAgent("a1"), makeAgent("a2"), makeAgent("a3")],
      tokens: [],
      transactions: [],
      pool: createPool(),
      tick: 0,
      nextTokenId: 1,
      nextTxId: 1,
    };
    let seed = 42;
    const random = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    const r1 = simulateTick(state, random);
    const state2 = {
      agents: [makeAgent("a1"), makeAgent("a2"), makeAgent("a3")],
      tokens: [],
      transactions: [],
      pool: createPool(),
      tick: 0,
      nextTokenId: 1,
      nextTxId: 1,
    };
    seed = 42;
    const r2 = simulateTick(state2, random);
    expect(r1.state.tick).toBe(r2.state.tick);
    expect(r1.state.transactions.length).toBe(r2.state.transactions.length);
    expect(r1.state.tokens.length).toBe(r2.state.tokens.length);
  });

  it("recalculates market prices on agents", () => {
    const agents = [makeAgent("a1"), makeAgent("a2")];
    const state = {
      agents,
      tokens: [],
      transactions: [],
      pool: createPool(),
      tick: 0,
      nextTokenId: 1,
      nextTxId: 1,
    };
    const { state: next } = simulateTick(state);
    next.agents.forEach((a) => {
      expect(typeof a.marketPrice).toBe("number");
      expect(a.marketPrice).toBeGreaterThanOrEqual(0);
      expect(a.marketPrice).toBeLessThanOrEqual(1);
    });
  });

  it("events array contains only notable event types when any occur", () => {
    const state = {
      agents: [makeAgent("a1"), makeAgent("a2"), makeAgent("a3")],
      tokens: [],
      transactions: [],
      pool: createPool(),
      tick: 0,
      nextTokenId: 1,
      nextTxId: 1,
    };
    const { events } = simulateTick(state);
    const types = new Set(events.map((e) => e.type));
    const allowed = new Set(["default", "large_trade", "price_swing", "pool_claim"]);
    types.forEach((t) => expect(allowed.has(t)).toBe(true));
  });
});
