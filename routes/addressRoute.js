import express from "express";
import verifyAuth from "../middlewares/verifyAuth.js";
import {
  addAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/", verifyAuth, addAddress);
addressRouter.get("/", verifyAuth, getAllAddresses);
addressRouter.patch("/:addressId", verifyAuth, updateAddress);
addressRouter.delete("/:addressId", verifyAuth, deleteAddress);

export default addressRouter;
