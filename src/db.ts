import mongoose from "mongoose";
import { config } from "./config";
import { DatabaseError } from "./errors/database-error";

/**
 * Db connection function
 */
mongoose.set("strictQuery", true);
const connectDb = async () => {
    try {
        const connect = await mongoose.connect(config.URL);
        console.log("Database connected!");
    } catch (error) {
        throw new DatabaseError();
    }
};

export { connectDb };
