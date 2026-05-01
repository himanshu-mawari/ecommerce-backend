import express from "express";
import verifyAuth from "../middlewares/verifyAuth.js";
import {addAddress} from "../controllers/addressController.js"

const addressRouter = express.Router();

addressRouter.post("/add" , verifyAuth , addAddress)

export default addressRouter;
