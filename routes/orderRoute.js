import express from "express";
import { createOrder , userOrders} from "../controllers/orderController.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const orderRouter = express.Router();

orderRouter.post("/" , verifyAuth , createOrder )
orderRouter.get("/user-orders" , verifyAuth , userOrders )


export default orderRouter;