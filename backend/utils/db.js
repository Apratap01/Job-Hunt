import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDb Connected Successfully")
    } catch (error) {
        console.log("Mongo DB cant connect", error)

    }
}




export default connectDB