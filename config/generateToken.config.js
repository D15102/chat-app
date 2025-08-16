import jwt from 'jsonwebtoken'

export const generateToken = (req, res, userData) => {
    const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    }

    // Add domain for production (Render deployment)
    if (process.env.NODE_ENV === "production" && process.env.COOKIE_DOMAIN) {
        cookieOptions.domain = process.env.COOKIE_DOMAIN
    }

    res.cookie('token', token, cookieOptions)
}