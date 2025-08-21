import { generateContentFromAI } from "../services/ai.service.js"


export const translateLang = async (req, res) => {
    try {
        if (!req.body) {
            return res.json({
                message: "Something Went Wrong !",
                success: false
            })
        }
        const { message } = req.body
        // console.log(message)
        const translatedContent = await generateContentFromAI(message)
        // console.log(translatedContent)
        return res.json({
            message: "Message Translated Successfully ✅",
            translatedContent,
            success: true
        })

    } catch (error) {
        return res.json({
            message: "Language detection error: " + error,
            success: false
        })
    }
}