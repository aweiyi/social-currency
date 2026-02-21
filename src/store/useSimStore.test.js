import { describe, it, expect, beforeEach } from "vitest";
import {
  useSimStore,
  computeGini,
  selectDualCurrencyMetrics,
} from "./useSimStore.js";

describe("useSimStore", () => {
  beforeEach(() => {
    useSimStore.getState().reset();
  });

  describe("computeGini", () => {
    it("returns 0 for empty or zero values", () => {
      expect(computeGini([])).toBe(0);
      expect(computeGini([0, 0, 0])).toBe(0);
    });

    it("returns 0 for perfect equality", () => {
      expect(computeGini([10, 10, 10])).toBe(0);
    });

    it("returns value in [0, 1] for positive values", () => {
      const g = computeGini([1, 2, 3, 4, 100]);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(1);
      expect(g).toBeGreaterThan(0.5);
    });

    it("filters out negative and non-number", () => {
      const g = computeGini([10, -1, 10, "x", 10]);
      expect(Number.isFinite(g)).toBe(true);
    });
  });

  describe("selectDualCurrencyMetrics", () => {
    it("returns zero counts and socialPremium 0 for empty transactions", () => {
      const m = selectDualCurrencyMetrics([]);
      expect(m.tokenExchangeCount).toBe(0);
      expect(m.fiatExchangeCount).toBe(0);
      expect(m.totalTokenValue).toBe(0);
      expect(m.totalFiatValue).toBe(0);
      expect(m.socialPremium).toBe(0);
    });

    it("counts token and fiat exchanges and computes socialPremium", () => {
      const tx = [
        { type: "exchange", paymentMethod: "social_token", tokenAmount: 2, tokenValue: 1.2, fiatEquivalent: 100 },
        { type: "exchange", paymentMethod: "fiat", fiatAmount: 50 },
      ];
      const m = selectDualCurrencyMetrics(tx);
      expect(m.tokenExchangeCount).toBe(1);
      expect(m.fiatExchangeCount).toBe(1);
      expect(m.totalTokenValue).toBe(1.2);
      expect(m.totalFiatValue).toBe(50);
      expect(m.totalFiatEquivalentForTokenTx).toBe(100);
      expect(m.socialPremium).toBeCloseTo(1.2 / 100);
    });
  });

  describe("reset", () => {
    it("restores tick 0 and empty transactions/tokens", () => {
      useSimStore.getState().runTick();
      useSimStore.getState().runTick();
      expect(useSimStore.getState().tick).toBe(2);
      useSimStore.getState().reset();
      expect(useSimStore.getState().tick).toBe(0);
      expect(useSimStore.getState().transactions.length).toBe(0);
      expect(useSimStore.getState().tokens.length).toBe(0);
      expect(useSimStore.getState().events.length).toBe(0);
    });

    it("restores agent count from seed", () => {
      const initial = useSimStore.getState().agents.length;
      useSimStore.getState().runTick();
      useSimStore.getState().reset();
      expect(useSimStore.getState().agents.length).toBe(initial);
    });
  });

  describe("runTick", () => {
    it("increments tick", () => {
      expect(useSimStore.getState().tick).toBe(0);
      useSimStore.getState().runTick();
      expect(useSimStore.getState().tick).toBe(1);
      useSimStore.getState().runTick();
      expect(useSimStore.getState().tick).toBe(2);
    });

    it("updates history arrays (length increases up to cap)", () => {
      useSimStore.getState().runTick();
      expect(useSimStore.getState().priceHistory.length).toBe(1);
      expect(useSimStore.getState().circulationHistory.length).toBe(1);
      expect(useSimStore.getState().poolHistory.length).toBe(1);
      expect(useSimStore.getState().giniHistory.length).toBe(1);
    });

    it("keeps agents array same length", () => {
      const len = useSimStore.getState().agents.length;
      useSimStore.getState().runTick();
      expect(useSimStore.getState().agents.length).toBe(len);
    });
  });
});
