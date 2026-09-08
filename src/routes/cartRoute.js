import express from "express";
import { addCartItem , getCart , updateCart , removeCart } from "../controllers/cartController.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const cartRouter = express.Router();

cartRouter.post("/add" , verifyAuth , addCartItem);
cartRouter.get("/" , verifyAuth , getCart);
cartRouter.post("/update/:cartItemId" , verifyAuth , updateCart);
cartRouter.delete("/remove/:cartItemId" , verifyAuth , removeCart);

export default cartRouter; 