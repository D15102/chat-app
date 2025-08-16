import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: new Date()
    }
})
const Users = mongoose.model('Users', userSchema)
export default Users