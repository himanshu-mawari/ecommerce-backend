import createError from "../helpers/createError.js";
import User from "../models/user.js";
import { validateSignupDetails } from "../helpers/validate.js";
import bcrypt from "bcrypt";

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, "Invalid credentials"));
    }

    const isCorrectPassword = await user.verifyPassword(password);
    if (!isCorrectPassword) {
      return next(createError(401, "Invalid credentials"));
    }

    const token = await user.getJwt();
    res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });

    const { password: _, ...safeUserDetails } = user.toObject();

    res.json({
      message: "Successfully logged-in user",
      data: safeUserDetails,
    });
  } catch (err) {
    next(err);
  }
};

export const signupUser = async (req, res, next) => {
  try {
    validateSignupDetails(req.body);
    const { name, email, password } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return next(createError(400, "Email already registered"));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = savedUser.getJwt();
    res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });

    const { password: _, ...safeUserDetails } = savedUser.toObject();

    res.json({
      message: "Successfully signup user",
      data: safeUserDetails,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (res) => {
  try {
    res.clearCookie("token");

    res.json({
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
