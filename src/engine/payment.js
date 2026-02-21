/**
 * Dual-currency: decide whether an exchange uses social_token or fiat.
 * Pure function; uses SKILL_CATEGORIES for fiat equivalent.
 */

/**
 * Decide payment method for an exchange between requester and provider.
 * @param {Object} requester - Agent requesting the favour (has fiatPreference, fiatBalance, reputation, marketPrice, tokens, personality)
 * @param {Object} provider - Agent providing the favour
 * @param {string} category - Skill category key
 * @param {number} hours - Estimated hours
 * @param {Object} skillCategories - Map of category key -> { fiatEquivalent }
 * @returns {{ method: 'social_token'|'fiat', amount: number, fiatEquivalent?: number }}
 */
export function decidePaymentMethod(requester, provider, category, hours, skillCategories) {
  const cat = skillCategories?.[category];
  const fiatEquivalentPerHour = cat?.fiatEquivalent ?? 30;
  const fiatCost = hours * fiatEquivalentPerHour;
  const tokenCost = hours;
  const tokenValue = tokenCost * (requester.marketPrice ?? 0.5);

  const requesterPref = requester.fiatPreference ?? 0.5;
  const providerPref = provider.fiatPreference ?? 0.5;
  const socialDrive = requester.personality?.social_drive ?? 0.5;
  const rep = requester.reputation?.overall ?? 0.5;
  const fiatBalance = requester.fiatBalance ?? 1000;
  const remainingCap = requester.tokens?.remainingCapacity ?? 0;

  // Factors favouring social tokens
  const socialScore =
    (1 - requesterPref) * 0.3 +
    (1 - providerPref) * 0.2 +
    socialDrive * 0.2 +
    (rep > 0.7 ? 0.2 : 0) +
    (fiatCost > fiatBalance * 0.1 ? 0.1 : 0);

  // Factors favouring fiat
  const fiatScore =
    requesterPref * 0.3 +
    providerPref * 0.2 +
    ((requester.marketPrice ?? 0.5) < 0.5 ? 0.3 : 0) +
    (category === "transport_errands" ? 0.1 : 0) +
    (remainingCap < 2 ? 0.1 : 0);

  if (socialScore > fiatScore) {
    return {
      method: "social_token",
      amount: tokenCost,
      fiatEquivalent: fiatCost,
    };
  }
  return {
    method: "fiat",
    amount: fiatCost,
    fiatEquivalent: fiatCost,
  };
}
