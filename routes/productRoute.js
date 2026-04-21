import { addProduct , removeProduct , singleProduct , listProduct , homeProduct } from "../controllers/productController.js";
import express from "express";
import upload from "../middlewares/multerMiddleware.js"; 
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const productRouter = express.Router();

productRouter.get("/home",verifyAuth, homeProduct);
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
productRouter.get("/list",verifyAuth, listProduct);
productRouter.delete("/remove/:productId" , verifyAuth , verifyAdmin, removeProduct);
productRouter.get("/:productId", verifyAuth, singleProduct);


export default productRouter; 
