import createError from "../helpers/createError.js";
import {
  validateCartItems,
  validateTransactionAddress,
} from "../helpers/validate.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

export const createOrder = async (req, res, next) => {
  try {
    validateTransactionAddress(req.body);

    const loggedInUser = req.user;
    const loggedInUserId = req.user._id;
    const loggedInUserCart = req.user.cartData;
    const { paymentMethod, shippingAddress } = req.body;

    if (!loggedInUserCart) {
      return next(createError(400, "Cart not exists"));
    } else if (loggedInUserCart.length === 0) {
      return next(createError(400, "Cart is empty"));
    }

    await validateCartItems(loggedInUserCart);

    const productIds = loggedInUserCart.map((item) => item.product);

    const productsData = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map();
    productsData.forEach((p) => productMap.set(p._id.toString(), p));

    // reduce stock
    for (const item of loggedInUserCart) {
      const product = productMap.get(item.product.toString());

      const variant = product.sizes.find((s) => s.size === item.size);
      console.log(variant);

      variant.stock -= item.quantity;

      await product.save();
    }

    const subTotal = loggedInUserCart.reduce((acc, item) => {
      const product = productMap.get(item.product.toString());

      if (!product) {
        throw createError(404, "Product not found");
      }

      return acc + item.quantity * product.price;
    }, 0);

    const orderItems = loggedInUserCart.map((item) => {
      const product = productMap.get(item.product.toString());

      if (!product) {
        throw createError(404, "Product not found");
      }

      return {
        productId: product._id,
        name: product.name,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const shippingFee = 50;
    const totalAmount = subTotal + shippingFee;

    const order = await Order.create({
      userId: loggedInUserId,
      items: orderItems,
      shippingAddress,
      subTotal,
      shippingFee,
      totalAmount,
      paymentMethod,
    });

    loggedInUser.cartData = [];
    await loggedInUser.save();

    res.json({
      message: "Successfully order created",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};
