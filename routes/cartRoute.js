import express from "express";
import { addCartItem , getCart , updateCart } from "../controllers/cartController.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const cartRouter = express.Router();

cartRouter.post("/add" , verifyAuth , addCartItem);
cartRouter.get("/" , verifyAuth , getCart);
cartRouter.post("/update/:productId" , verifyAuth , updateCart);

export default cartRouter;