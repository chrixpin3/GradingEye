import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY_1 });

async function testAPI() {
    try {
        console.log("Testing Gemini API connection...");
        console.log("API Key:", process.env.GEMINI_API_KEY_1);

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: "user", parts: [{ text: "Hello, respond with 'API working'" }] }],
        });

        console.log("✅ API Response:", response.text);
        console.log("✅ Connection successful!");
    } catch (error) {
        console.error("❌ API Error:", error.message);
        console.error("Full error:", error);
    }
}

testAPI();
