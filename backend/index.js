import express from "express"
import dotenv from "dotenv"
import { createServer } from 'http'
import cors from "cors"


dotenv.config()

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json())
app.use(cors());


import { GoogleGenAI } from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function main() {
    const response = await ai.models.generateContentStream({
        model: 'gemini-2.0-flash-001',
        contents: 'Write a 100-word poem.',
    });
    for await (const chunk of response) {
        console.log(chunk.text);
    }
}

main();



// const server = createServer(app);


app.listen(PORT, () => {
    try {
        console.log(`Server Listening at port - ${PORT}`);

    } catch (error) {
        console.log(error.message);
    }

})