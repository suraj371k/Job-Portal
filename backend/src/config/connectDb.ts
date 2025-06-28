import mongoose from "mongoose";

const connectDb = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }
    
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log("mongodb connected"))
        .catch((err) => console.log("Mongodb connection failed", err));
}

export default connectDb;