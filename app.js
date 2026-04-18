import express from "express";
import "dotenv/config";
import connectDB from "./config/database.js";
import connectCloudinary from "./config/cloudinary.js";
import authRouter from "./routes/auth.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import productRouter from "./routes/productRoute.js";
import cookieParser from "cookie-parser";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/user.js";
import cors from "cors";

const app = express();
const ports = process.env.PORTS || 4000;


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // tells the browser that the se rver allows cookies or authentication credentials to be sent and received from that origin
  }),
);

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
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
