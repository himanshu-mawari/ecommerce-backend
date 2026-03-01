import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";

const app = express();
const ports = process.env.PORTS || 4000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
    await connectCloudinary();
    console.log("Cloudinary connected successfully");
    app.listen(ports, () => {
      console.log(`Server will listening at ${ports}`);
    });
  } catch (err) {
    console.error("Startup failed: " + err.message);
  }
};

startServer();
