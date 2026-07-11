import createError from "../helpers/createError.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import { validateUpdatesData } from "../helpers/validate.js";
import { mongoose } from "mongoose";
const PRODUCT_NEEDED_DATA = "name images price"

export const getUserData = (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const { password: _, ...safeUserDetails } = loggedInUser.toObject();

    res.json({
      message: "getUserData call listen successfully",
      user: safeUserDetails,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserData = async (req, res, next) => {
  try {
    validateUpdatesData(req.body);

    const loggedInUser = req.user;
    const updatesData = req.body;
    const allowedFields = ["name", "email", "phone"];

    const updates = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    Object.keys(updates).forEach((key) => {
      loggedInUser[key] = updates[key];
    });

    await loggedInUser.save();
    res.json({
      message: "getUserData call listen successfully",
      user: loggedInUser,
    });
  } catch (err) {
    next(err);
  }
};

export const addWishlistProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const loggedInUser = req.user;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(createError(400, "Invalid product id"));
    }

    if (loggedInUser.wishlist.includes(product_id)) {
      return next(createError(400, "Product already exists in wishlist"));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(createError(404, "Product not found"));
    }

    loggedInUser.wishlist.push(product._id);

    await loggedInUser.save();

    res.json({
      message: "Added product on wishlist successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getWishlistProduct = async (req, res, next) => {
  try {
    const loggedInUser = await req.user.populate("wishlist", PRODUCT_NEEDED_DATA);

    res.json({
      message: "Successfully reads wishlist products",
      data: { wishlist: loggedInUser.wishlist },
    });
  } catch (err) {
    next(err);
  }
};
