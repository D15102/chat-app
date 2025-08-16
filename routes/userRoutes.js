import express from 'express'
import { login, logout, me, signup } from '../controllers/authController.js'
import { protectedRoute } from '../middlewares/protectedRoute.js'


const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.get('/me', protectedRoute, me)
router.get('/logout', logout)

export default router

