import { validateProductDetails } from "../helpers/validate.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Product from "../models/product.js";
import createError from "../helpers/createError.js";

export const addProduct = async (req, res, next) => {
  const uploadedImages = [];

  try {
    validateProductDetails(req.body, req.files);

    const { name, description, category, subCategory, price, stockQuantity } =
      req.body;

    const uploadPromises = Object.values(req.files).map(async (fileArr) => {
      const file = fileArr[0];

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });

      fs.unlinkSync(file.path);

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    });

    const results = await Promise.all(uploadPromises);

    uploadedImages.push(...results);

    const newProduct = await Product.create({
      name,
      description,
      category,
      subCategory,
      price,
      stockQuantity,
      images: uploadedImages,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    await Promise.all(
      uploadedImages.map((img) => cloudinary.uploader.destroy(img.public_id)),
    );

    next(err);
  }
};

export const removeProduct = async (req, res, next) => {
  try {
    const { id } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return next(createError(404, "Product doesn't exist"));
    }

    const deletePromises = product.images.map((img) => {
      cloudinary.uploader.destroy(img.public_id);
    });
    
    await Promise.all(deletePromises);
    await product.deleteOne();

    res.json({
      message: "Successfully removed the product from data",
    });
  } catch (err) {
    next(err);
  }
};

export const listProduct = () => {};
export const singleProduct = () => {};
