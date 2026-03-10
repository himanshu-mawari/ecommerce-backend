import express from "express";
import { addCartItem , getCart , updateCart , removeCart } from "../controllers/cartController.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const cartRouter = express.Router();

cartRouter.post("/add" , verifyAuth , addCartItem);
cartRouter.get("/" , verifyAuth , getCart);
cartRouter.post("/update/:productId" , verifyAuth , updateCart);
cartRouter.delete("/remove/:productId" , verifyAuth , removeCart);

export default cartRouter;