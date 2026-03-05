import { addProduct , removeProduct , singleProduct , listProduct } from "../controllers/productController.js";
import express from "express";
import upload from "../middlewares/multerMiddleware.js"; 
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const productRouter = express.Router();

productRouter.post(
  "/add", 
  verifyAuth,
  verifyAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]),
  addProduct
);
productRouter.delete("/remove", removeProduct);
productRouter.get("/:id", singleProduct);
productRouter.get("/list", listProduct);


export default productRouter; 
