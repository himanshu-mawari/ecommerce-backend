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
        image : product.images[0].url,
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
      paymentDetails: {
        method : paymentMethod
      },
        paidAt: null,
  shippedAt: null
    });

    if (paymentMethod === "COD") {
      for (const item of loggedInUserCart) {
        const product = productMap.get(item.product.toString());
        if (!product) {
          throw createError(404, "Product not found");
        }

        const variant = product.sizes.find((s) => s.size === item.size);
        if (!variant) {
          throw createError(404, "Selected size not available");
        }

        if (item.quantity > variant.stock) {
          throw createError(
            400,
            `Not enough stock for ${product.name} size ${item.size}`,
          );
        }
        variant.stock -= item.quantity;

        await product.save();
      }
    };

    if(paymentMethod === "ONLINE"){}

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

export const userOrders = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;

    const getUserOrders = await Order.find({ userId: loggedInUserId })
      .sort({ createdAt: -1 })


    if (getUserOrders.length === 0) {
      return res.json({
        message: "No orders found",
        data: [],
      });
    }
    res.json({
      message: "User orders fetched successfully",
      data: getUserOrders,
    });
  } catch (err) {
    next(err);
  }
};
