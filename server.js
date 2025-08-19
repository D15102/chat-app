import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './config/mongodb.config.js'
import userRoutes from './routes/userRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import { app, server } from './Socket-Io/socket-io-server.js'


config()
const PORT = process.env.PORT


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/users', userRoutes)
app.use("/message", messageRoutes)




//Production Deployment Code
if (process.env.NODE_ENV === "production") {
    const dirPath = path.resolve()
    app.use(express.static("./frontend/dist"))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(dirPath, "./frontend/dist", "index.html"))
    })
}

server.listen(PORT, () => {
    connectDB()
    console.log(`Server Is running on http://localhost:${PORT}`)
})