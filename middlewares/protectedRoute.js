import jwt from 'jsonwebtoken'
export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.json({
                message: "Token Not Found !",
                success: false
            })
        }
        const decodedUserId = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decodedUserId.userId
        next()

    } catch (error) {
        console.log(error.message)
    }
}

/**
 * 
 * {
 * id : user._id
 * email :  ""
 * }
 *const decoded =  jwt.verrify()
 req.user = {
 id
 email :
 iat : ""}
 req.user.id    
 */