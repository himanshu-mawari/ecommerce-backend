import express from "express";
import verifyAuth from "../middlewares/verifyAuth.js";
import {addAddress , getAllAddresses} from "../controllers/addressController.js"

const addressRouter = express.Router();

addressRouter.post("/" , verifyAuth , addAddress)
addressRouter.get("/" , verifyAuth , getAllAddresses )

export default addressRouter;
