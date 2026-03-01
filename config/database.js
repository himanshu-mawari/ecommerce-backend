import mongoose from "mongoose";
import "dotenv/config";

const password = encodeURIComponent(process.env.PASSWORD);
const dbName = encodeURIComponent(process.env.DB_NAME);
const conn = encodeURIComponent(process.env.CONNECTION);
const username = encodeURIComponent(process.env.USER_NAME);

const connectDB = async () => {
   await mongoose.connect(
        `mongodb+srv://${username}:${password}@${conn}/${dbName}`
    )
};

export default connectDB;