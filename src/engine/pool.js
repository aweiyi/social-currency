/**
 * Community pool: levy, default handling, absorption.
 * Pure functions; no side effects.
 */

import { SKILL_KEYS } from "../data/categories.js";

const LEVY_RATE = 0.1; // 10% of each issuance

/**
 * Create initial pool state.
 * @returns {Object} - { totalCapacity, byCategory, claimsProcessed, claimsPending, healthScore }
 */
export function createPool() {
  const byCategory = {};
  SKILL_KEYS.forEach((k) => {
    byCategory[k] = 0;
  });
  return {
    totalCapacity: 0,
    byCategory,
    claimsProcessed: 0,
    claimsPending: 0,
    healthScore: 1,
  };
}

/**
 * Add levy (10% of issuance) to the pool for a category.
 * @param {Object} pool - Current pool state
 * @param {number} amount - Token amount issued (hours)
 * @param {string} category - Skill category key
 * @returns {Object} - New pool state (immutable)
 */
export function addLevy(pool, amount, category) {
  if (!pool.byCategory.hasOwnProperty(category)) return pool;
  const levy = amount * LEVY_RATE;
  const newByCategory = { ...pool.byCategory, [category]: pool.byCategory[category] + levy };
  return {
    ...pool,
    byCategory: newByCategory,
    totalCapacity: pool.totalCapacity + levy,
  };
}

/**
 * Compute pool health score: poolCapacity / totalOutstandingObligations.
 * Outstanding = sum of active token amounts where issuer is still active (we use total issued - redeemed as proxy, or pass outstanding amount).
 * @param {Object} pool - Pool state
 * @param {number} totalOutstanding - Total obligation hours outstanding (e.g. sum of active token amounts)
 * @returns {number} - healthScore 0-2+ (can be >1 if well collateralised)
 */
export function computeHealthScore(pool, totalOutstanding) {
  if (totalOutstanding <= 0) return 1;
  return pool.totalCapacity / totalOutstanding;
}

/**
 * When an agent defaults (goes inactive), mark all their issued tokens as defaulted.
 * Caller (simulation) uses this to update tokens array and then run absorption.
 * This function returns the list of token ids that are now defaulted (for the event log).
 * @param {string} agentId - The agent who defaulted (issuer)
 * @param {Object[]} tokens - All tokens (will not be mutated here; caller mutates)
 * @returns {string[]} - Token ids that were issued by this agent (caller marks them defaulted)
 */
export function getDefaultedTokenIds(agentId, tokens) {
  return tokens
    .filter((t) => t.issuer === agentId && t.status === "active")
    .map((t) => t.id);
}

/**
 * Attempt to absorb a defaulted token: either a volunteer fulfils it (reputation bonus)
 * or the pool covers what it can from the token's category.
 * Returns updates to apply: token status, optional pool deduction, optional volunteer reputation.
 * @param {Object} token - Defaulted token { id, issuer, holder, category, amount, status }
 * @param {Object|null} volunteer - Agent who volunteers (same category skill), or null to use pool
 * @param {Object} pool - Current pool state
 * @returns {{ tokenStatus: string, pool: Object, volunteerRepBonus?: number }} - Updates
 */
export function attemptAbsorption(token, volunteer, pool) {
  const category = token.category;
  const amount = token.amount ?? 0;
  const categoryBalance = pool.byCategory[category] ?? 0;

  if (volunteer && amount > 0) {
    // Volunteer fulfils: token redeemed, volunteer gets 1.5x reputation bonus (handled by caller)
    return {
      tokenStatus: "redeemed",
      pool,
      volunteerRepBonus: 1.5,
    };
  }

  // No volunteer: pool covers what it can
  const cover = Math.min(amount, categoryBalance);
  const newCategoryBalance = categoryBalance - cover;
  const newByCategory = { ...pool.byCategory, [category]: newCategoryBalance };
  const newPool = {
    ...pool,
    byCategory: newByCategory,
    totalCapacity: Math.max(0, pool.totalCapacity - cover),
    claimsProcessed: pool.claimsProcessed + 1,
  };

  return {
    tokenStatus: cover >= amount ? "pooled" : "defaulted",
    pool: newPool,
    absorbedAmount: cover,
    remainingAmount: Math.max(0, amount - cover),
    reason: cover >= amount ? "full_coverage" : categoryBalance > 0 ? "partial_coverage" : "no_funds"
  };
}
