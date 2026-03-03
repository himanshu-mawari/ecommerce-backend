import { validateProductDetails } from "../helpers/validate.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Product from "../models/product.js";

export const addProduct = async (req, res, next) => {
  const uploadedImages = [];
  try {
    validateProductDetails(req.body, req.files);

    const { name, description, category, subCategory, price, stockQuantity } =
      req.body;

    for (let key in req.files) {
      const file = req.files[key][0];

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      fs.unlinkSync(file.path);
    }

    const newProduct = new Product({
      name,
      description,
      category,
      subCategory,
      price,
      stockQuantity,
      images: uploadedImages,
    });

    await newProduct.save();

    res.json({
      message: "Successfully stored product details",
      product: newProduct,
    });
  } catch (err) {
    for (const img of uploadedImages) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    next(err);
  }
};
export const removeProduct = () => {};
export const listProduct = () => {};
export const singleProduct = () => {};
