import createError from "../helpers/createError.js";
import User from "../models/user.js";
import { validateUpdatesData } from "../helpers/validate.js";

export const getUserData = (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const { password: _, ...safeUserDetails } = loggedInUser.toObject();

    res.json({
      message: "getUserData call listen successfully",
      user: safeUserDetails,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserData = async (req, res, next) => {
  try {
    validateUpdatesData(req.body);

    const loggedInUser = req.user;
    const updatesData = req.body;
    const allowedFields = ["name", "email", "phone"];

    const updates = {};
    

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    Object.keys(updates).forEach((key) => {
      loggedInUser[key] = updates[key];
    });

    await loggedInUser.save();
    res.json({
      message: "getUserData call listen successfully",
      user: loggedInUser,
    });
  } catch (err) {
    next(err);
  }
};
