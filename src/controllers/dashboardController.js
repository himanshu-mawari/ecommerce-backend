import createError from "../helpers/createError.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

export const getdashboardData = async (req, res, next) => {
  const staleThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);
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
        .limit(6)
        .select(
          "orderId shippingAddress.name status paymentDetails.status totalAmount createdAt",
        )
        .lean(),
      Product.find({
        "sizes.stock": { $lte: 5 },
      })
        .limit(5)
        .select("images name sizes")
        .lean(),
      Order.countDocuments({
        createdAt: { $lt: staleThreshold },
      }),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const transformedProducts = lowStockProducts.map((products) => {
      const hasOutOfStock = products.sizes.some((size) => size.stock === 0);

      let status = "";
      if (hasOutOfStock) {
        status = "Out of Stock";
      } else {
        status = "Low Stock";
      }

      const affectedSizes = () => {
        if (status === "Low Stock") {
          return products.sizes.filter(
            (size) => size.stock <= 5 && size.stock !== 0,
          );
        } else {
          return products.sizes.filter((size) => size.stock === 0);
        }
      };

      return {
        ...products,
        status,
        affectedSizes:affectedSizes()
      };
    });

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
        lowStockProducts: transformedProducts,
        stalePendingCount: stuckPendingOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};
