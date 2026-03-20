import express from "express";
import { createOrder , userOrders , singleOrder , updateOrderStatus} from "../controllers/orderController.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const orderRouter = express.Router();

orderRouter.post("/" , verifyAuth , createOrder )
orderRouter.get("/user-orders" , verifyAuth , userOrders )
orderRouter.get("/:orderId" , verifyAuth , singleOrder)
orderRouter.patch("/:orderId/status" , verifyAuth , verifyAdmin , updateOrderStatus)


export default orderRouter;