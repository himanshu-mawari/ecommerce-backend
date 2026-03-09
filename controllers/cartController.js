import Product from "../models/product.js";
import createError from "../helpers/createError.js";
import User from "../models/user.js";

// Add item to user cart
export const addCartItem = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserCart = req.user.cartData;
    const { productId, quantity = 1 } = req.body;

    const productExist = await Product.findById(productId);
    if (!productExist) {
      return next(createError(404, "Product not found"));
    }

    let existingItem = loggedInUserCart.find(
      (item) => item.product.toString() === productId,
    );
    if (!existingItem) {
      loggedInUserCart.push({
        product: productId,
        quantity: quantity,
      });
    } else {
      existingItem.quantity += quantity;
    }

    await loggedInUser.save();

    res.json({
      message: "Product added to cart",
      data: loggedInUserCart,
    });
  } catch (err) {
    next(err);
  }
};

// View user cart
export const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("cartData.product");

    const cart = user.cartData;

    res.json({
      message: "User cart",
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};

// Update cart item quantity
export const updateCart = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const { productId } = req.params;
    const { quantity } = req.body;

    const productExist = await Product.findById(productId);
    if (!productExist) {
      return next(createError(404, "Product doesn't exist"));
    }

    const existCart = loggedInUser.cartData.find(
      (item) => item.product.toString() === productId,
    );
    console.log(existCart)
    if (!existCart) {
      return next(createError(404, "Product not found"));
    }

    if (isNaN(quantity) || quantity < 0) {
      return next(createError(400, "Quantity must be an positive number"));
    }

    if (productExist.stockQuantity < quantity) {
      return next(
        createError(400, `Only ${productExist.stockQuantity} items available`),
      );
    }

    if (quantity === 0) {
      loggedInUser.cartData = loggedInUser.cartData.filter(
        (item) => item.product.toString() !== productId,
      );
    } else {
      existCart.quantity = quantity;
    }

    await loggedInUser.save();

    res.json({
      message: "Successfully updated cart",
      data: loggedInUser.cartData,
    });
  } catch (err) {
    next(err);
  }
};
