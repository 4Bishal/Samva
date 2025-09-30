import dotenv from "dotenv";
import axios from "axios";


export const getApiResposneFromGemini = async (message) => {
    try {
        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
            {
                contents: {
                    parts: [
                        {
                            text: message,
                        }
                    ],
                    role: "user",
                }
            },
            {
                headers: {
                    "x-goog-api-key": process.env.GEMINI_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );


        const answer = response.data.candidates[0].content.parts[0].text;
        // const role = response.data.candidates[0].content.role;

        return answer;
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json(error.response?.data || { message: error.message });
    }
}