import cloudinary from "../config/cloudinary.config.js"
import userModal from "../models/Users.js"
const bufferToDataURI = (fileFormat, buffer) => {
    const base64 = buffer.toString("base64")
    return `data:${fileFormat};base64,${base64}`
}
export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({
                message: "File not Found !",
                success: false
            })
        }
        // console.log(req.file)
        const fileFormat = req.file.mimetype
        const buffer = req.file.buffer
        const file64 = bufferToDataURI(fileFormat, buffer)
        const uploadResult = await cloudinary.uploader.upload(file64, {
            resource_type: "image",
            folder: "chat-app/DPs",
        })
        const user = await userModal.findById({ _id: req.userId })
        // console.log(user)
        user.profilePicture = uploadResult.secure_url
        await user.save()
        return res.json({
            message: "Image Uploaded Successfully ✅",
            success: true,
            user
        })
    } catch (error) {
        return res.json({
            message: error.message,
            success: false
        })
    }
}