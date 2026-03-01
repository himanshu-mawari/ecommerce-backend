import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [6, "Name must be at least 6 characters"],
      maxLength: [30, "Name cannot exceed 30 chararcters"],
    },
    email: {
      type: String,
      index: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must at least 6 characters"],
    },
    cartData: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  { minimize: false },
);

const User = mongoose.model("User", userSchema);
export default User;
