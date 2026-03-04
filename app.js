import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";
import authRouter from "./routes/auth.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import productRouter from "./routes/productRoute.js";

const app = express();
const ports = process.env.PORTS || 4000;

app.use(express.json());
app.use("/api/user", authRouter);
app.use("/api/products", productRouter);
app.use(errorMiddleware);

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
