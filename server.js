import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './config/mongodb.config.js'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'
import path from 'path'
config()
import cookieParser from 'cookie-parser'
const app = express()
const PORT = process.env.PORT

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/users', userRoutes)

if (process.env.NODE_ENV === "production") {
    const dirPath = path.resolve()
    app.use(express.static("./frontend/dist"))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(dirPath, "./frontend/dist", "index.html"))
    })
}

app.listen(PORT, () => {
    connectDB()
    console.log(`Server Is running on http://localhost:${PORT}`)
})