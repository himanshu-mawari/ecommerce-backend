import Product from "../models/product.js";
import createError from "../helpers/createError.js";
import User from "../models/user.js";

export const addCartItem = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserCart = req.user.cartData;
    const { productId, size, quantity = 1 } = req.body;

    const productExist = await Product.findById(productId);
    if (!productExist) {
      return next(createError(404, "Product not found"));
    }

    const sizeExist = productExist.sizes.find((s) => s.size === size);

    if (!sizeExist) {
      return next(createError(400, "Invalid size"));
    }

    let existingItem = loggedInUserCart.find(
      (item) => item.product.toString() === productId && item.size === size,
    );
    if (!existingItem) {
      loggedInUserCart.push({
        product: productId,
        size,
        quantity,
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
export const updateCart = async (req, res, next) => {
  try {
    const user = req.user;
    const { cartItemId } = req.params;
    const { quantity } = req.body;


    if (!Number.isInteger(quantity) || quantity < 0) {
      return next(createError(400, "Invalid quantity"));
    }

    const cartItem = user.cartData.id(cartItemId);

    if (!cartItem) {
      return next(createError(404, "Cart item not found"));
    }

    const product = await Product.findById(cartItem.product).select("sizes");

    if (!product) {
      return next(createError(404, "Product not found"));
    }

    const sizeStock = product.sizes.find((s) => s.size === cartItem.size);

    if (!sizeStock) {
      return next(createError(404, "Size not found"));
    }

    if (quantity > sizeStock.stock) {
      return next(createError(400, `Only ${sizeStock.stock} available`));
    }

    cartItem.quantity = quantity;

    await user.save();

    res.status(200).json({
      success: true,
      data: user.cartData,
    });
  } catch (err) {
    next(err);
  }
};
export const removeCart = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const { cartItemId } = req.params;

    const cartItem = loggedInUser.cartData.id(cartItemId);

    if (!cartItem) {
      return next(createError(404, "Cart item not found"));
    }

    cartItem.deleteOne();
 
    await loggedInUser.save();

    res.json({
      message: "Item removed from cart",
      data: loggedInUser.cartData, 
    });
  } catch (err) {
    next(err);
  } 
};
