import jwt from 'jsonwebtoken'

export const generateToken = (req, res, userData) => {
    const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // Always true on Render (HTTPS)
        sameSite: 'none', // Required for cross-origin
        maxAge: 60 * 60 * 1000, // 1 hour
        domain: process.env.COOKIE_DOMAIN || undefined,
    })
}