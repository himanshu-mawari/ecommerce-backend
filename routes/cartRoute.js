import express from "express";
import { addCartItem } from "../controllers/cartController.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const cartRouter = express.Router();

cartRouter.post("/add" , verifyAuth , addCartItem)




export default cartRouter;