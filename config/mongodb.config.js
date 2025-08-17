import mongoose from 'mongoose'

export const connectDB = () => { 
    try {
    mongoose.connect(process.env.MONGODB_URI)
    const connect = mongoose.connection
    connect.on('connected', () => console.log(`MongoDB Connected Successfully ✅`))
    connect.on('error', () => console.log(`MongoDB Connection Error ❌`)) 

} catch (error) {
    console.log(error.message)
}

}