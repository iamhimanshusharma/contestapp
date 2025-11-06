import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const response = await mongoose.connect(`${process.env.DB_CONNECTION_URI}/${process.env.DB_NAME}`);
        if (!response) {
            console.log("DB connection failed");
        }
        console.log("DB connection successful");
    } catch (error) {
        console.log(error);
    }
}