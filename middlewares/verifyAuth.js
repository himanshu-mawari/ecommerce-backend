import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import createError from "../helpers/createError.js";

const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(createError(401, "Token not found"));
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const { _id } = decodedToken;

    const user = await User.findById(_id);
    if (!user) {
      return next(createError(401, "User not found"));
    }
    req.user = user;
    
    next();
  } catch (err) {
    next(err);
  }
};

export default verifyAuth;
