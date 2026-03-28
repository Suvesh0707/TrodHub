import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await mongoose.connect(mongoURI);
        console.log("ADMIN SERVICE: MONGODB CONNECTED SUCCESSFULLY !");
    } catch (error) {
        console.log("Error while connecting mongoose:", error);
        process.exit(1); 
    }
};
