import conversationModal from '../models/Conversation.js'
import messageModal from '../models/Messages.js'
import { getReceiverSocketId, io } from '../Socket-Io/socket-io-server.js'
export const sendMessage = async (req, res) => {
    try {
        if (!req.body) {
            return res.json({
                message: "No Data Given",
                success: false
            })
        }
        // console.log(req.body)
        const { message } = req.body

        const { id: receiverId } = req.params
        const senderId = req.userId
        // console.log(message)
        // console.log(senderId)
        // console.log(receiverId)

        let coversation = await conversationModal.findOne({
            members: { $all: [senderId, receiverId] }
        }).populate("messages")
        if (!coversation) {
            coversation = new conversationModal({
                members: [senderId, receiverId],
            })
            // await coversation.save()
            const newMessage = new messageModal({
                senderId,
                receiverId,
                message
            })
            if (newMessage) {
                // await newMessage.save()
                coversation.messages.push(newMessage._id)
                // await coversation.save()
            }
            await Promise.all([coversation.save(), newMessage.save()])
            return res.json({
                message: "Message Sent Successfully",
                success: true,
                newMessage
            })
        } else {
            const newMessage = new messageModal({
                senderId,
                receiverId,
                message
            })
            if (newMessage) {
                // await newMessage.save()
                coversation.messages.push(newMessage._id)
                // await coversation.save()
            }
            await Promise.all([coversation.save(), newMessage.save()])
            const receiverSocketId = getReceiverSocketId(receiverId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage)
            }
            return res.json({
                message: "Message Sent Successfully",
                success: true,
                newMessage
            })
        }

    } catch (error) {
        return res.json({
            message: error.message,
            success: false
        })
    }
}

export const getMessage = async (req, res) => {
    try {

        const { id: chatMessageId } = req.params
        const senderId = req.userId
        const coversation = await conversationModal.findOne({
            members: { $all: [senderId, chatMessageId] }
        }).populate("messages")

        if (!coversation) {
            return res.json({
                message: "No Conversation Found !",
                success: false
            })
        }
        const messages = coversation.messages
        console.log(messages)
        return res.json({ messages, success: true })

    } catch (error) {
        return res.json({
            message: "Messages Getting Error",
            success: false
        })
    }
}