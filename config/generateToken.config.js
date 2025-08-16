import jwt from 'jsonwebtoken'

export const generateToken = (req, res, userData) => {
    const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.cookie('token', token, {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
    })
}