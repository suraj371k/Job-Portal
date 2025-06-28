import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (err: any) {
        console.log("MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

export default connectDb;