import express from 'express'
import { getAccessToken,login, logout, me, signup } from '../controllers/authController.js'
import { protectedRoute } from '../middlewares/protectedRoute.js'
import { getAvailableUsers } from '../controllers/showAvailableUsersController.js'
import multer from 'multer'
import { uploadProfilePicture } from '../controllers/uploadController.js'

const router = express.Router()

//multer config
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/login', login)
router.post('/signup', signup)
router.get('/github/getAccessToken', getAccessToken)
router.get('/me', protectedRoute, me)
router.get('/logout', logout)
router.get("/getAllUsers", protectedRoute, getAvailableUsers)
router.post("/upload/profilePicture", protectedRoute, upload.single("file"), uploadProfilePicture)

export default router

