import { validateProductDetails } from "../helpers/validate.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Product from "../models/product.js";
import createError from "../helpers/createError.js";
import mongoose from "mongoose";

export const addProduct = async (req, res, next) => {
  const uploadedImages = [];

  try {
    validateProductDetails(req.body, req.files);

    const { name, description, category, subCategory, price, collectionType } =
      req.body;
    const sizes = JSON.parse(req.body.sizes);

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
      collectionType,
      price,
      sizes,
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

export const updateProduct = async (req, res, next) => {
  let updatedImage = [];
  try {
    const { productId } = req.params;

    const productExist = await Product.findById(productId);
    if (!productExist) {
      return next(createError(404, "Product not found"));
    }

    const existedImage = productExist.images;

    if (req.files && Object.keys(req.files).length > 0) {
      for (let img of existedImage) {
        await cloudinary.uploader.destroy(img.public_id);
      }

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
      updatedImage.push(...results);
      productExist.images = updatedImage;
    }

    Object.keys(req.body).forEach((key) => (productExist[key] = req.body[key]));
    await productExist.save();

    res.json({
        message: "Successfully update the product",
        product: {fileData:req.files , bodyData:req.body},
    });
  } catch (err) {
    next(err);
  }
};

export const removeProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return next(createError(404, "Product doesn't exist"));
    }

    const deletePromises = product.images.map((img) =>
      cloudinary.uploader.destroy(img.public_id),
    );

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
    const {
      category,
      bestSeller,
      search,
      sort,
      minPrice,
      maxPrice,
      collectionType,
      gender,
    } = req.query;

    const skip = (page - 1) * limit;

    const filter = {};
    let sortOption = { createdAt: -1 };

    if (category) {
      filter.category = category;
    }
    if (bestSeller) {
      filter.bestSeller = bestSeller === "true";
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (maxPrice) {
        filter.price.$lte = maxPrice;
      }
      if (minPrice) {
        filter.price.$gte = minPrice;
      }
    }
    if (collectionType) {
      filter.collectionType = collectionType;
    }

    const allProducts = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      message: "Successfully send list of products",
      data: allProducts,
    });
  } catch (err) {
    next(err);
  }
};

export const adminListProduct = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    let filters = {};

    if (category) {
      filters.category = category;
    }
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filters.name = { $regex: escaped, $options: "i" };
    }
    const productList = await Product.find(filters);

    res.json({
      data: "hey this is adminListProduct, long time how r u!!!",
      product: productList,
    });
  } catch (err) {
    next(err);
  }
};

export const singleProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(createError(400, "Invalid product ID"));
    }

    const findProduct = await Product.findById(productId);

    if (!findProduct) {
      return next(createError(404, "Product does not exist from these id"));
    }

    res.json({
      message: "Successfully fetch product detail",
      data: findProduct,
    });
  } catch (err) {
    next(err);
  }
};
export const homeProduct = async (req, res, next) => {
  try {
    const latestProduct = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(8);

    const bestSeller = await Product.find({ bestSeller: true }).limit(8);

    res.json({
      message: "Successfully fetched home products",
      data: {
        latest: latestProduct,
        bestSeller: bestSeller,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const relatedProducts = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const activeProduct = await Product.findById(productId);

    if (!activeProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(productId) },
          category: activeProduct.category,
        },
      },
      {
        $addFields: {
          priority: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      {
                        $eq: ["$collectionType", activeProduct.collectionType],
                      },
                      { $eq: ["$subCategory", activeProduct.subCategory] },
                    ],
                  },
                  then: 1,
                },
                {
                  case: {
                    $eq: ["$subCategory", activeProduct.subCategory],
                  },
                  then: 2,
                },
                {
                  case: {
                    $eq: ["$collectionType", activeProduct.collectionType],
                  },
                  then: 3,
                },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { priority: 1 } },
      { $limit: 6 },
    ]);

    res.json({
      message: "Successfully fetched related products",
      data: relatedProducts,
    });
  } catch (err) {
    next(err);
  }
};
