import jwt from 'jsonwebtoken'

export const generateToken = (req, res, userData) => {
    
    const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge : 3600000
    })

}