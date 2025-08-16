import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModal from '../models/Users.js'
import { generateToken } from '../config/generateToken.config.js'

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.json({
                message: "Something Went Wrong ❌",
                success: false
            })
        }
        const existingUser = await userModal.findOne({ email })
        if (existingUser) {
            return res.json({
                message: "User Already Exists ℹ️",
                success: false
            })
        }
        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(password, salt)
        const userData = new userModal({
            username,
            email,
            password: hash
        })
        await userData.save()
        generateToken(req, res, userData)
        return res.json({
            message: "Account Created Successfully !",
            success: true
        })
    } catch (error) {
        return res.json({
            message: error.message,
            success: false
        })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.json({
                message: "Something Went Wrong ❌",
                success: false
            })
        }
        const existingUser = await userModal.findOne({ email })
        if (!existingUser) {
            return res.json({
                message: "User Not Exists ℹ️",
                success: false
            })
        }
        const isMatch = await bcryptjs.compare(password, existingUser.password)
        if (!isMatch) {
            return res.json({
                message: "Password Not Matched ℹ️",
                success: false
            })
        }
        generateToken(req, res, existingUser)
        return res.json({
            message: "Logged In Successfully ✅",
            success: true
        })
    } catch (error) {
        return res.json({
            message: error.message,
            success: false
        })
    }
}
export const logout = async (req, res) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.json({
                message: "Token Not Found !",
                success: false
            })
        }
        res.clearCookie("token")
        return res.json({
            message: "Logged Out Successfully ✅",
            success: true
        })
    } catch (error) {
        return res.json({
            message: error.message,
            success: false
        })
    }
}

export const me = async (req, res) => {
    try {
        const userId = req.userId
        const user = await userModal.findById({ _id: userId })
        return res.json({
            message: "User Fetched Successfully ✅",
            success: true,
            user
        })


    } catch (error) {
        console.log(error.message)
    }
}