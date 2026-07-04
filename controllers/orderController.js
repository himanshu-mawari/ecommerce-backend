import createError from "../helpers/createError.js";
import {
  validateCartItems,
  validateTransactionAddress,
} from "../helpers/validate.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import mongoose from "mongoose";
import Address from "../models/address.js";

export const createOrder = async (req, res, next) => {
  try {
    validateTransactionAddress(req.body);

    const loggedInUser = req.user;
    const loggedInUserId = req.user._id;
    const loggedInUserCart = req.user.cartData;
    const { paymentMethod, shippingAddressId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(shippingAddressId)) {
      return next(createError(400, "Invalid address ID"));
    }

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
        return next(createError(404, "Product not found"));
      }

      return acc + item.quantity * product.price;
    }, 0);

    const orderItems = loggedInUserCart.map((item) => {
      const product = productMap.get(item.product.toString());

      if (!product) {
        return next(createError(404, "Product not found"));
      }

      return {
        productId: product._id,
        name: product.name,
        image: product.images[0].url,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const shippingFee = 100;
    const totalAmount = subTotal + shippingFee;

    const address = await Address.findOne({
      _id: shippingAddressId,
      userId: loggedInUserId,
    });
    if (!address) {
      return next(createError(404, "Invalid or unauthorized address"));
    }

    const orderId = Math.floor(10000 + Math.random() * 9000);

    const order = await Order.create({
      userId: loggedInUserId,
      orderId,
      items: orderItems,
      shippingAddress: address,
      subTotal,
      shippingFee,
      totalAmount,
      paymentDetails: {
        method: paymentMethod,
      },
      paidAt: null,
      shippedAt: null,
      deliveredAt: null,
      cancelledAt: null,
      packedAt: null,
      confirmed: null,
    });

    if (paymentMethod === "COD") {
      for (const item of loggedInUserCart) {
        const product = productMap.get(item.product.toString());
        if (!product) {
          return next(createError(404, "Product not found"));
        }

        const variant = product.sizes.find((s) => s.size === item.size);
        if (!variant) {
          return next(createError(404, "Selected size not valid"));
        }

        if (item.quantity > variant.stock) {
          return next(
            createError(
              (400, `Not enough stock for ${product.name} size ${item.size}`),
            ),
          );
        }
        variant.stock -= item.quantity;

        await product.save();
      }
      loggedInUser.cartData = [];
    }

    if (paymentMethod === "ONLINE") {
    }

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
      .select("items status createdAt paymentDetails totalAmount")
      .sort({ createdAt: -1 });

    if (getUserOrders.length === 0) {
      return res.json({
        message: "No orders found",
        data: [],
      });
    }

    const total = await Order.countDocuments({ userId: loggedInUserId });

    res.json({
      message: "User orders fetched successfully",
      data: getUserOrders,
      total,
    });
  } catch (err) {
    next(err);
  }
};

export const singleOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const loggedInUserId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return next(createError(400, "Invalid order ID"));
    }

    const order = await Order.findOne({
      _id: orderId,
      userId: loggedInUserId,
    });
    if (!order) {
      return next(createError(404, "Order not found"));
    }

    res.json({
      message: "Order fetched Successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return next(createError(400, "Invalid order ID"));
    }

    const allowedStatus = [
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return next(createError(400, "Invalid order status"));
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    if (order.status === status) {
      return next(createError(400, "Order already has this status"));
    }

    const statusFlow = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["packed", "cancelled"],
      packed: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    const allowedNext = statusFlow[order.status];

    if (!allowedNext) {
      return next(createError(400, "Invalid current order status"));
    }

    if (!allowedNext.includes(status)) {
      return next(createError(400, "Invalid status transition"));
    }
    const STATUS_TIMESTAMP_FIELD = {
      confirmed: "confirmedAt",
      packed: "packedAt",
      shipped: "shippedAt",
      delivered: "deliveredAt",
      cancelled: "cancelledAt",
    };
    order.status = status;
    const field = STATUS_TIMESTAMP_FIELD[status];
    if (field) order[field] = new Date();
    await order.save();

    res.json({
      message: "Order status updated successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return next(createError(400, "Invalid order ID"));
    }

    if (status !== "cancelled") {
      return next(createError(400, "Invalid order status"));
    }

    const order = await Order.findOne({
      userId: loggedInUserId,
      _id: orderId,
    });

    if (!order) {
      return next(createError(404, "Order not found"));
    }

    const allowedStatus = ["pending", "confirmed"];
    if (!allowedStatus.includes(order.status)) {
      return next(createError(400, "Order cannot be cancelled at this stage"));
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const allOrders = async (req, res, next) => {
  try {
    let { page, pageSize } = req.query;
    const {
      q: search,
      payment_status: paymentStatus,
      order_status: orderStatus,
      date,
    } = req.query;

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 10;
    const skip = (page - 1) * pageSize;

    let filters = {};

    if (paymentStatus) {
      filters["paymentDetails.status"] = paymentStatus;
    }

    if (orderStatus) {
      filters.status = orderStatus;
    }

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const orCondition = [
        { "shippingAddress.name": { $regex: escaped, $options: "i" } },
      ];

      if (/^\d+$/.test(search)) {
        orCondition.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$orderId" },
              regex: escaped,
              options: "i",
            },
          },
        });
      }

      filters.$or = orCondition;
    }

    if (date) {
      const DATE_RANGE_DAYS = {
        today: 1,
        last7days: 7,
        last30days: 30,
      };

      const days = DATE_RANGE_DAYS[date];

      if (days) {
        const endingDate = new Date();
        endingDate.setHours(0, 0, 0, 0);
        endingDate.setDate(endingDate.getDate() + 1);

        const startingDate = new Date(endingDate);
        startingDate.setDate(startingDate.getDate() - days);

        filters.createdAt = { $gte: startingDate, $lt: endingDate };
      }
    }

    const [totalPendingOrdersCount, totalCancelledOrdersCount] =
      await Promise.all([
        Order.countDocuments({
          status: "pending",
        }),
        Order.countDocuments({
          status: "cancelled",
        }),
      ]);

    const [result] = await Order.aggregate([
      { $match: filters },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $skip: skip }, { $limit: pageSize }],
        },
      },
    ]);
    const totalOrdersCount = result?.metadata[0]?.totalCount;
    res.json({
      message: "Successfully send all orders",
      data: {
        metadata: {
          page,
          pageSize,
          totalPages: Math.ceil(totalOrdersCount / pageSize),
          totalPendingOrdersCount,
          totalCancelledOrdersCount,
          totalOrdersCount,
        },
        data: result?.data,
      },
    });
  } catch (err) {
    next(err);
  }
};
