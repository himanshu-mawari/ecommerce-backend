import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderId:{
      type: Number,
      required:true,
      unique:true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          enum: {
            values: ["S", "M", "L", "XL", "XXL"],
            message: `{VALUE} is not a valid size`,
          },
          required: true,
        },
        quantity: { 
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    shippingAddress: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/,
      },

      pincode: {
        type: String,
        required: true,
        match: /^\d{6}$/,
      },

      houseNo: {
        type: String,
        required: true,
        trim: true,
      },

      street: {
        type: String,
        required: true,
        trim: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },
    },
    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        message: `{VALUE} is not a valid order status`,
      },
      default: "pending",
      required: true,
    },
    paymentDetails: {
      status: {
        type: String,
        enum: {
          values: ["pending", "paid", "failed"],
          message: `{VALUE} is not a valid payment status`,
        },
        default: "pending",
      },
      method: {
        type: String,
        enum: {
          values: ["COD", "ONLINE"],
          message: `{VALUE} is not a valid payment method`,
        },
        required: true,
      },
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
