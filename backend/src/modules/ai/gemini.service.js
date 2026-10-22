import {GoogleGenAI} from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})

export const generateStructuredContent = async({
    prompt,
    responseSchema,
}) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        // model: "gemini-3.8-flash",

        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    })

    return JSON.parse(response.text)
}
export default ai