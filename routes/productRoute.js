import { addProduct , removeProduct , singleProduct , listProduct , homeProduct , relatedProducts , updateProduct} from "../controllers/productController.js";
import express from "express";
import upload from "../middlewares/multerMiddleware.js"; 
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { adminListProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/home", homeProduct);
productRouter.get("/related-product/:productId", relatedProducts);
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
productRouter.patch("/edit/:productId" , verifyAuth , verifyAdmin ,upload.fields([
  {name:"image1" , maxCount: 1},
  {name:"image2" , maxCount: 1},
  {name:"image3" , maxCount: 1},
  {name:"image4" , maxCount: 1}
]) ,updateProduct)
productRouter.get("/admin/list",verifyAuth, adminListProduct);
productRouter.get("/list",verifyAuth, listProduct);

productRouter.delete("/remove/:productId" , verifyAuth , verifyAdmin, removeProduct);
productRouter.get("/:productId", singleProduct);


export default productRouter; 
