import { validateProductDetails } from "../helpers/validate.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Product from "../models/product.js";
import createError from "../helpers/createError.js";
import mongoose from "mongoose"

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

export const listProduct = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const allProducts = await Product.find({}).skip(skip).limit(limit).lean();
    res.json({
      message: "Successfully send list of products",
      data: allProducts,
    });
  } catch (err) {
    next(err);
  }
};

export const singleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid product ID"));
    }

    const findProduct = await Product.findById(id);

    if (!findProduct) {
      return next(createError(404, "Product does not exist from these id"));
    }

    res.json({
      message: "Successfully read the api call",
      data: findProduct,
    });
  } catch (err) {
    next(err);
  }
};
