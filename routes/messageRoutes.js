import express from 'express'
import { getMessage, sendMessage } from '../controllers/messageController.js'
import { protectedRoute } from '../middlewares/protectedRoute.js'

const router = express.Router()

router.post("/send/:id", protectedRoute, sendMessage)
router.get("/get/:id", protectedRoute, getMessage)

export default router