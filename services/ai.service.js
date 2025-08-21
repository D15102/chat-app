import { GoogleGenAI } from '@google/genai'
import { config } from 'dotenv'
config()
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})

export const generateContentFromAI = async (message) => {
    const contentsData = [{
        role: "user",
        parts: [{
            text: `
                    You are a translation assistant.  
                    Your task: 
                    - Detect the language of the user message: "${message}"  
                    - If the message is already in English, return it exactly as it is.  
                    - If the message is in any other language, return only the English translation.  
                    - Do not include explanations, notes, or the detected language name.  
                    - The response must be a single plain text line, no formatting, no quotes.  

                    Examples:
                    - Input: "ha bye" → Output: "yes bye"  
                    - Input: "नमस्ते" → Output: "hello"  
                    - Input: "How are you?" → Output: "How are you?"  
                    `
        }],

    }]
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: contentsData
        })
        const res = response.candidates[0].content.parts[0].text
        return res
    } catch (error) {
        console.log(error)
        return error
    }
}