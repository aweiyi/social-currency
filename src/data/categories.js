// src/data/categories.js
// 16 favour-based skill categories across 4 domains

export const SKILL_CATEGORIES = {
  // ═══════════════════════════════════
  // KNOWLEDGE & DIGITAL
  // ═══════════════════════════════════
  software_dev: {
    label: "Software Dev",
    emoji: "💻",
    domain: "knowledge",
    color: "#3b82f6", // blue
    description: "Coding, debugging, tech setup, automation",
    avgDuration: 2.0,
    fiatEquivalent: 50,
  },
  design_creative: {
    label: "Design & Creative",
    emoji: "🎨",
    domain: "knowledge",
    color: "#8b5cf6", // violet
    description: "Graphics, UI, visual design, video editing",
    avgDuration: 1.5,
    fiatEquivalent: 40,
  },
  writing_content: {
    label: "Writing & Content",
    emoji: "✍️",
    domain: "knowledge",
    color: "#6366f1", // indigo
    description: "Copywriting, editing, content strategy, newsletters",
    avgDuration: 1.5,
    fiatEquivalent: 35,
  },
  data_analysis: {
    label: "Data Analysis",
    emoji: "📊",
    domain: "knowledge",
    color: "#0ea5e9", // sky
    description: "Spreadsheets, analytics, research, dashboards",
    avgDuration: 2.0,
    fiatEquivalent: 45,
  },

  // ═══════════════════════════════════
  // PHYSICAL & HANDS-ON
  // ═══════════════════════════════════
  cooking_food: {
    label: "Cooking & Food",
    emoji: "🍳",
    domain: "physical",
    color: "#f97316", // orange
    description: "Meal prep, baking, dietary planning, food sharing",
    avgDuration: 1.5,
    fiatEquivalent: 25,
  },
  handyman_repair: {
    label: "Handyman & Repair",
    emoji: "🔧",
    domain: "physical",
    color: "#78716c", // stone
    description: "Fixing appliances, furniture assembly, basic repairs",
    avgDuration: 1.0,
    fiatEquivalent: 30,
  },
  crafting_building: {
    label: "Crafting & Building",
    emoji: "🛠️",
    domain: "physical",
    color: "#a16207", // amber-dark
    description: "Woodwork, 3D printing, physical prototyping, sewing",
    avgDuration: 2.5,
    fiatEquivalent: 35,
  },
  transport_errands: {
    label: "Transport & Errands",
    emoji: "🚗",
    domain: "physical",
    color: "#65a30d", // lime
    description: "Rides, airport pickups, grocery runs, deliveries",
    avgDuration: 0.5,
    fiatEquivalent: 15,
  },

  // ═══════════════════════════════════
  // SOCIAL & PERSONAL
  // ═══════════════════════════════════
  mentorship_advice: {
    label: "Mentorship & Advice",
    emoji: "🧭",
    domain: "social",
    color: "#f59e0b", // amber
    description: "Career guidance, life advice, accountability partner",
    avgDuration: 1.0,
    fiatEquivalent: 60,
  },
  language_tutoring: {
    label: "Language Tutoring",
    emoji: "🗣️",
    domain: "social",
    color: "#14b8a6", // teal
    description: "Language practice, translation, cultural context",
    avgDuration: 1.0,
    fiatEquivalent: 30,
  },
  event_organising: {
    label: "Event Organising",
    emoji: "🎪",
    domain: "social",
    color: "#ec4899", // pink
    description: "Planning gatherings, coordinating groups, logistics",
    avgDuration: 3.0,
    fiatEquivalent: 25,
  },
  photography: {
    label: "Photography",
    emoji: "📸",
    domain: "social",
    color: "#d946ef", // fuchsia
    description: "Portraits, event coverage, content shoots",
    avgDuration: 1.5,
    fiatEquivalent: 40,
  },

  // ═══════════════════════════════════
  // WELLNESS & LIFESTYLE
  // ═══════════════════════════════════
  fitness_training: {
    label: "Fitness Training",
    emoji: "💪",
    domain: "wellness",
    color: "#ef4444", // red
    description: "Workout buddies, training plans, sports partners",
    avgDuration: 1.0,
    fiatEquivalent: 35,
  },
  wellness_healing: {
    label: "Wellness & Healing",
    emoji: "🧘",
    domain: "wellness",
    color: "#10b981", // emerald
    description: "Meditation guidance, massage, stress relief, reiki",
    avgDuration: 1.0,
    fiatEquivalent: 40,
  },
  pet_care: {
    label: "Pet Care",
    emoji: "🐕",
    domain: "wellness",
    color: "#a78bfa", // violet-light
    description: "Dog walking, pet sitting, animal companionship",
    avgDuration: 0.5,
    fiatEquivalent: 15,
  },
  music_performance: {
    label: "Music & Performance",
    emoji: "🎵",
    domain: "wellness",
    color: "#fb923c", // orange-light
    description: "Jam sessions, music lessons, karaoke nights",
    avgDuration: 1.0,
    fiatEquivalent: 30,
  },
};

export const DOMAINS = {
  knowledge: { label: "Knowledge & Digital", emoji: "🧠", color: "#3b82f6" },
  physical: { label: "Physical & Hands-on", emoji: "🤲", color: "#f97316" },
  social: { label: "Social & Personal", emoji: "🤝", color: "#f59e0b" },
  wellness: { label: "Wellness & Lifestyle", emoji: "🌿", color: "#10b981" },
};

export const SKILL_KEYS = Object.keys(SKILL_CATEGORIES);
export const DOMAIN_KEYS = Object.keys(DOMAINS);

// Helper: get all skills in a domain
export function getSkillsByDomain(domain) {
  return Object.entries(SKILL_CATEGORIES)
    .filter(([_, cat]) => cat.domain === domain)
    .map(([key, cat]) => ({ key, ...cat }));
}

// Helper: get fiat equivalent for a token exchange
export function getFiatEquivalent(category, hours) {
  return hours * (SKILL_CATEGORIES[category]?.fiatEquivalent || 30);
}
