import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "Product name must be at least contain 3 characters"],
      maxLength: [30, "Product name must be at most contain 30 characters"],
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ["Men", "Women", "Kids"],
        message: `{VALUE} is not a valid category`,
      },
    },
    subCategory: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    sizes: [
      {
        size: {
          type : String,
          enum: {
            values: ["S", "M", "L", "XL", "XXL"],
            message: `{VALUE} is not a valid size`,
          },
          required : true
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
