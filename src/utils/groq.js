/**
 * Utility for calling the Groq API for narrative generation.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generateNarrative(prompt, apiKey) {
    if (!apiKey) {
        throw new Error("GROQ_API_KEY_MISSING");
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are a creative economic reporter for FavourNet, a network state simulation. Write short, punchy narratives (max 100 words) that explain simulation events through the lens of agent personalities and economic styles. Be dramatic and insightful."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 250,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            if (response.status === 429) throw new Error("RATE_LIMITED");
            throw new Error(error.error?.message || "GROQ_API_ERROR");
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "The network remains silent...";
    } catch (err) {
        console.error("Narrative generation failed:", err);
        throw err;
    }
}

export function buildAgentStoryPrompt(agent, recentEvents = []) {
    return `
Agent Profile:
- Name: ${agent.name}
- Background: ${agent.background}
- Personality: ${JSON.stringify(agent.personality)}
- Economic Style: ${agent.economic_style}

Context:
Write a "state of the agent" narrative. If they are active, describe their current strategy. If they defaulted, tell the story of their downfall.
${recentEvents.length > 0 ? `Recent events: ${JSON.stringify(recentEvents)}` : ""}
`;
}

export function buildEventExplanationPrompt(event) {
    return `
Event Details:
${JSON.stringify(event)}

Context:
Explain this event in a way that highlights the social and economic consequences for the FavourNet community. 
If it's a default, focus on the 'victim' tokens. If it's a pool claim, focus on the safety net mechanism.
`;
}
