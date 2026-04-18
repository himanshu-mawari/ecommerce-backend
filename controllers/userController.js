import createError from "../helpers/createError.js";
import User from "../models/user.js";
import { validateUpdatesData } from "../helpers/validate.js";


export const getUserData = (req, res, next) => {
  try {
    const loggedInUser = req.user;

    res.json({
      message: "getUserData call listen successfully",
      user: loggedInUser,
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

    Object.keys(req.body).forEach(
      (key) => (loggedInUser[key] = updatesData[key]),
    );

    await loggedInUser.save();
    res.json({
      message: "getUserData call listen successfully",
      user: loggedInUser,
    });
  } catch (err) {
    next(err);
  }
};
