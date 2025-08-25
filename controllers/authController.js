import bcryptjs from 'bcryptjs'
import userModal from '../models/Users.js'
import { generateToken } from '../config/generateToken.config.js'

export const signup = async (req, res) => {
    try {
        const { signUpMode } = req.body
        if (signUpMode === "Email") {
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
                success: true,
                user: userData,
            })
        }

        if (signUpMode === "Github") {
            const response = await fetch(`https://api.github.com/user`, {
                method: "GET",
                headers: {
                    "Authorization": req.get("Authorization")
                }
            })
            const githubUserData = await response.json()
            // console.log(githubUserData)
            const existingUser = await userModal.findOne({ username: githubUserData.name })
            if (existingUser) {
                return res.json({
                    message: "User Already Exists",
                    success: false
                })
            }
            const userData = new userModal({
                username: githubUserData.name,
                profilePicture: githubUserData.avatar_url
            })
            await userData.save()
            generateToken(req, res, userData)
            return res.json({
                message: "Account Created Successfully with Github ✅",
                success: true,
                user: userData
            })


        }

    } catch (error) {
        return res.json({
            message: error.message,
            success: false
        })
    }
}
export const login = async (req, res) => {
    try {
        const { loginMode } = req.body
        // console.log(loginMode)
        if (loginMode === "Email") {
            const { email, password } = req.body
            if (!email || !password) {
                return res.json({
                    message: "Something Went Wrong ❌",
                    success: false
                })
            }
            const existingUser = await userModal.findOne({ email })
            // console.log(existingUser)
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
                success: true,
                user: existingUser
            })
        }
        if (loginMode === "Github") {
            const response = await fetch("https://api.github.com/user", {
                method: "GET",
                headers: {
                    "Authorization": req.get("Authorization")
                }
            })
            const githubUserData = await response.json()
            // console.log(githubUserData)
            const existingUser = await userModal.findOne({ username: githubUserData.name })
            if (!existingUser) {
                return res.json({
                    message: "Github User Not Exists",
                    success: false
                })
            }
            generateToken(req, res, existingUser)
            return res.json({
                message: "Logged In With Github Successfully ✅",
                user: existingUser,
                success: true
            })

        }
    } catch (error) {
        return res.json({
            message: error.message,
            success: false
        })
    }
}
export const getAccessToken = async (req, res) => {
    //getting and Access Token From Github
    const { code, mode } = req.query
    console.log(mode)
    let client_id, client_secret;
    if (mode === "Login") {
        client_id = process.env.GITHUB_CLIENT_ID_LOGIN;
        client_secret = process.env.GITHUB_CLIENT_SECRET_LOGIN;
    } else if (mode === "Signup") {
        client_id = process.env.GITHUB_CLIENT_ID_SIGNUP;
        client_secret = process.env.GITHUB_CLIENT_SECRET_SIGNUP;
    } else {
        return res.json({ success: false, message: "Invalid mode" });
    }
    const params = `?client_id=${client_id}&client_secret=${client_secret}&code=${code}`
    await fetch(`https://github.com/login/oauth/access_token${params}`, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    }).then(response => { return response.json() })
        .then(data => {
            console.log(`Access Token Data : ${JSON.stringify(data)}`)
            return res.json(data)
        })
        .catch(error => console.log(error))
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
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        })
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

