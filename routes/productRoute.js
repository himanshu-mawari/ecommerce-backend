import { addProduct , removeProduct , singleProduct , listProduct } from "../controllers/productController.js";
import express from "express";
import upload from "../middlewares/multerMiddleware.js"; 

const productRouter = express.Router();

productRouter.post(
  "/add",
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
