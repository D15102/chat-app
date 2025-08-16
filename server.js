import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './config/mongodb.config.js'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'
config()
import cookieParser from 'cookie-parser'
const app = express()
const PORT = process.env.PORT

app.use(cors({
    origin: [process.env.CLIENT_URL,'http://localhost:5173'],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/users', userRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log(`Server Is running on http://localhost:${PORT}`)
})