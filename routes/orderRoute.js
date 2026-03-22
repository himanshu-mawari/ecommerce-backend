import express from "express";
import { createOrder , userOrders , singleOrder , updateOrderStatus , cancelOrder , allOrders} from "../controllers/orderController.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const orderRouter = express.Router();

orderRouter.post("/" , verifyAuth , createOrder )
orderRouter.get("/user-orders" , verifyAuth , userOrders )
orderRouter.get("/all-orders" , verifyAuth , verifyAdmin ,  allOrders)
orderRouter.get("/:orderId" , verifyAuth , singleOrder)
orderRouter.patch("/:orderId/cancel" , verifyAuth , cancelOrder)
orderRouter.patch("/:orderId/status" , verifyAuth , verifyAdmin , updateOrderStatus)


export default orderRouter;