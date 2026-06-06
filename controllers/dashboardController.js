import createError from "../helpers/createError.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

export const getdashboardData = async (req, res, next) => {
  try {
    const [
      productsCount,
      ordersCount,
      completeOrderCount,
      pendingOrderCount,
      revenueResult,
      recentOrders,
      lowStockProducts,
      stuckPendingOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({ status: "pending" }),
      Order.aggregate([
        {
          $match: {
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "orderId shippingAddress.name status paymentDetails.status totalAmount createdAt",
        ).lean(),
      Product.find({
        "sizes.stock": { $lte: 5 },
      })
        .limit(5)
        .select("images name sizes")
        .lean(),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      data: {
        stats: {
          totalProducts: productsCount,
          totalOrders: ordersCount,
          completeOrders: completeOrderCount,
          pendingOrders: pendingOrderCount,
          totalRevenue,
        },
        recentOrders,
        lowStockProductCount,
      },
    });
  } catch (err) {
    next(err);
  }
};
