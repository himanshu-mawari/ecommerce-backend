import Address from "../models/address.js";
import { validateAddressDetails } from "../helpers/validate.js";

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
