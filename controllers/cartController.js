import product from "../models/product.js";
import createError from "../helpers/createError.js";

// Add item to user cart
export const addCartItem = async (req, res, next) => {
  try {
    const loggedInUser = req.user;
    const loggedInUserCart = req.user.cartData;
    const { productId, quantity = 1 } = req.body;

    const productExist = await product.findById(productId);
    if (!productExist) {
      return next(createError(404, "Product not found"));
    }

    let existingItem = loggedInUserCart.find(
      (item ) => item.product.toString() === productId,
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
      data: loggedInUserCart
    });
  } catch (err) {
    next(err);
  }
};
