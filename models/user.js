import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

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
      unique: true,
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
    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: `{VALUE} is not a valid role`,
      },
      default : "user"
    },
  },
  { minimize: false },
);

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const oldPassword = user.password;

  const isPasswordMatch = await bcrypt.compare(password, oldPassword);
  return isPasswordMatch;
};

userSchema.methods.getJwt = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);
export default User;
