import axios from "axios";

/**
 * Generate a clean, single-line title for a chat conversation
 * @param {string} firstMessage - The first user message in the chat
 * @returns {string} - AI-generated clean title (max 50 chars)
 */
export const generateChatTitle = async (firstMessage) => {
    if (!firstMessage) return "New Chat";

    try {
        // 🔹 Optimized prompt: force ONE concise phrase, no explanations, no extra text
        const prompt = `
Generate ONE concise, clear, descriptive title (max 6 words) for this conversation:
"${firstMessage}"
Return ONLY the title. Do NOT add explanations, options, or extra text.
`;

        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                contents: [
                    {
                        role: "user", // Gemini requires 'user' or 'model'
                        parts: [{ text: prompt }],
                    },
                ],
            },
            {
                headers: {
                    "x-goog-api-key": process.env.GEMINI_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        // 🔹 Extract the raw text
        let title =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "New Chat";

        // 🔹 Clean up: remove newlines, extra spaces
        title = title.replace(/[\r\n]+/g, " ").trim();

        // 🔹 Remove anything after first punctuation (avoid extra instructions)
        title = title.split(/[:.;!?\n]/)[0].trim();

        // 🔹 Limit length to 50 characters
        if (title.length > 50) title = title.slice(0, 50).trim();

        // 🔹 Fallback
        return title || "New Chat";
    } catch (err) {
        console.error("Error generating title:", err.response?.data || err.message);
        return "New Chat";
    }
};
