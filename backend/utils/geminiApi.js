import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const getApiResponseFromGemini = async (messages, limit = 10) => {
    try {
        // Keep only the last 'limit' messages
        const recentMessages = messages.slice(-limit);

        const contents = recentMessages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }));

        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            { contents },
            {
                headers: {
                    "x-goog-api-key": process.env.GEMINI_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        // Return the AI's response as string
        return response.data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error(error.response?.data || error.message);
        return `Error from Gemini: ${error.response?.data?.message || error.message}`;
    }
};
