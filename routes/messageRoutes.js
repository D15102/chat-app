import express from 'express'
import { getMessage, sendMessage } from '../controllers/messageController.js'
import { protectedRoute } from '../middlewares/protectedRoute.js'
import { translateLang } from '../controllers/translateController.js'

const router = express.Router()

router.post("/send/:id", protectedRoute, sendMessage)
router.get("/get/:id", protectedRoute, getMessage)
router.post("/translate", protectedRoute, translateLang)

export default router