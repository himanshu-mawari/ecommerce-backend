import express from "express";
import { createOrder } from "../controllers/orderController.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const orderRouter = express.Router();

orderRouter.post("/" , verifyAuth , createOrder )

export default orderRouter;