import Address from "../models/address.js";
import { validateAddressDetails } from "../helpers/validate.js";
import createError from "../helpers/createError.js";
import mongoose from "mongoose";

export const addAddress = async (req, res, next) => {
  try {
    validateAddressDetails(req.body);

    const loggedInUserId = req.user._id;

    const { pincode, houseNo, street, district, state, name, phone } = req.body;

    const address = new Address({
      pincode,
      houseNo,
      street,
      district,
      state,
      name,
      phone,
      userId: loggedInUserId,
    });

    await address.save();

    res.json({
      message: "Address created successfully",
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

export const singleAddress = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return next(createError(400, "Invalid address ID"));
    }

    const address = await Address.findOne({
      _id: addressId,
      userId: loggedInUserId,
    });
    if (!address) {
      return next(createError(404, "Address not found"));
    }

    res.json({
      message: "Address fetched successfully",
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllAddresses = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;

    const loggedInUserAddresses = await Address.find({
      userId: loggedInUserId,
    });

    if (!loggedInUserAddresses) {
      return next(createError(404, "Address not found"));
    }

    res.json({
      message: "Addresses fetched successfully",
      data: loggedInUserAddresses,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return next(createError(400, "Invalid address ID"));
    }

    const address = await Address.findOne({
      _id: addressId,
      userId: loggedInUserId,
    });
    if (!address) {
      return next(createError(404, "Address not found"));
    }

    Object.keys(req.body).forEach((key) => (address[key] = req.body[key]));
    await address.save();

    res.json({
      message: "Address updated successfully",
      data: address,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const { addressId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return next(createError(400, "Invalid address ID"));
    }

    const address = await Address.findOneAndDelete({
      _id: addressId,
      userId: loggedInUserId,
    });

    if (!address) {
      return next(createError(404, "Address not found"));
    }

    res.json({
      message: "Address deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
