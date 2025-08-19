import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
export const app = express()



export const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})

const users = {}

export const getReceiverSocketId = (receiverId) => {
    return users[receiverId]
}

io.on("connection", (socket) => {
    console.log(`Client Connected ${socket.id}`)
    const userId = socket.handshake.query.userId
    // console.log(userId)
    if (userId) {
        users[userId] = socket.id
    }
    io.emit("getOnline", Object.keys(users))
    // console.log(users)
    socket.on("disconnect", () => {
        console.log(`Client Disconnected ${socket.id}`)
        delete users[userId]
        io.emit("getOffline", Object.keys(users))
    })
})

