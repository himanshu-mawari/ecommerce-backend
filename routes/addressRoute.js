import express from "express";
import verifyAuth from "../middlewares/verifyAuth.js";
import {
  addAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
  singleAddress,
} from "../controllers/addressController.js";

const addressRouter = express.Router();

addressRouter.post("/", verifyAuth, addAddress);
addressRouter.get("/", verifyAuth, getAllAddresses);
addressRouter.get("/:addressId", verifyAuth, singleAddress);
addressRouter.patch("/:addressId", verifyAuth, updateAddress);
addressRouter.delete("/:addressId", verifyAuth, deleteAddress);

export default addressRouter;
