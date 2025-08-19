import userModal from '../models/Users.js'

export const getAvailableUsers = async (req, res) => {
    try {
        const allUsers= await userModal.find({ _id: { $ne: req.userId } })
        return res.json({
            message: "Users Fetched Successfully ✅",
            allUsers,
            success: true
        })
    } catch (error) {
        return res.json({
            message: "Something Went Wrong !",
            success: false
        })
    }
}