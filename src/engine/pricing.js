/**
 * Pure pricing functions for the FavourNet simulation.
 * Formula: reputation(0.4) + inverseObligationRatio(0.25) + velocity(0.2) + scarcity(0.15)
 */

/**
 * Get the agent's top skill category (highest non-zero skill).
 * @param {Object} agent - Agent with skills object
 * @returns {string|null} - Skill key or null if no skills
 */
export function getTopSkill(agent) {
  if (!agent?.skills) return null;
  let topKey = null;
  let topVal = 0;
  for (const [key, val] of Object.entries(agent.skills)) {
    if (typeof val === "number" && val > topVal) {
      topVal = val;
      topKey = key;
    }
  }
  return topKey;
}

/**
 * For the agent's top skill, how rare is it in the community?
 * Higher scarcity = fewer other providers = higher price component.
 * @param {Object} agent - Agent with skills
 * @param {Object[]} allAgents - All agents (active filter applied inside)
 * @returns {number} - 0-1, where 1 = very rare
 */
export function calculateCategoryScarcity(agent, allAgents) {
  const topSkill = getTopSkill(agent);
  if (!topSkill || !allAgents?.length) return 0;
  const active = allAgents.filter((a) => a.isActive);
  if (active.length === 0) return 0;
  const providersCount = active.filter(
    (a) => (a.skills?.[topSkill] ?? 0) > 0.5
  ).length;
  return 1 - providersCount / active.length;
}

/**
 * Calculate market price for an agent (0-1 scale).
 * Formula: reputation(0.4) + (1 - obligationRatio)(0.25) + velocity(0.2) + scarcity(0.15)
 * @param {Object} agent - Agent with reputation, tokens, redemptionSpeed, skills
 * @param {Object[]} allAgents - All agents (for scarcity)
 * @returns {number} - Price in [0, 1]
 */
export function calculateMarketPrice(agent, allAgents) {
  const reputation = Math.max(0, Math.min(1, agent.reputation?.overall ?? 0.5));
  const issued = agent.tokens?.issued ?? 0;
  const redeemed = Math.max(1, agent.tokens?.redeemed ?? 1);
  const obligationRatio = Math.min(issued / redeemed, 5) / 5; // 0-1 capped
  const velocity = Math.max(0, Math.min(1, agent.redemptionSpeed ?? 0.5));
  const scarcity = calculateCategoryScarcity(agent, allAgents);

  return (
    reputation * 0.4 +
    (1 - obligationRatio) * 0.25 +
    velocity * 0.2 +
    scarcity * 0.15
  );
}
