import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    username: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type : String,
        default : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
    }
}, { timestamps: true })
const Users = mongoose.model('Users', userSchema)
export default Users