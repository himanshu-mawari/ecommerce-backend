import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, "Name must be at least 2 characters"],
    maxLength: [30, "Name cannot exceed 30 characters"]
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be at least 8 characters"]
  },

  cartData: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        min: 1,
        required: true
      }
    }
  ],

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }

});

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
