import validator from "validator";
import createError from "./createError.js";
import Product from "../models/product.js";

export const validateSignupDetails = ({ name, email, password }) => {
  if (!name || name.trim().length < 3) {
    throw createError(400, "Name must be at least contain 3 characters");
  } else if (!email || !validator.isEmail(email)) {
    throw createError(400, "Invalid email address");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw createError(
      400,
      "Password must contain uppercase , lowercase , number and symbol ",
    );
  } else if (password.length < 6) {
    throw createError(400, "Password must be at least 6 digit");
  }
};

export const validateProductDetails = (
  { name, description, category, subCategory, price, sizes },
  reqFiles,
) => {
  if (!name?.trim()) {
    throw createError(400, "Product name is required");
  }
  if (name.trim().length < 3) {
    throw createError(400, "Product name must contain at least 3 characters");
  }
  if (!description?.trim()) {
    throw createError(400, "Product description is required");
  }
  if (!category) {
    throw createError(400, "Category is required");
  }
  if (!["men", "women", "kids"].includes(category)) {
    throw createError(400, "Invalid category");
  }
  if (!subCategory?.trim()) {
    throw createError(400, "Sub category is required");
  }
  if (price == null || price < 0) {
    throw createError(400, "Invalid price");
  }
  if (!reqFiles || Object.keys(reqFiles).length === 0) {
    throw createError(400, "At least one image is required");
  }
  if (!sizes) {
    throw createError(400, "Product sizes are required");
  }
  let parsedSizes;
  try {
    parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
  } catch {
    throw createError(400, "Invalid sizes format");
  }
  if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
    throw createError(400, "Sizes must be a non-empty array");
  }
  const validSizes = ["S", "M", "L", "XL", "XXL"];
  const seen = new Set();

  parsedSizes.forEach((item) => {
    if (!validSizes.includes(item.size)) {
      throw createError(400, `Invalid size: ${item.size}`);
    }
    if (typeof item.stock !== "number" || item.stock < 0) {
      throw createError(400, "Invalid stock quantity");
    }
    if (seen.has(item.size)) {
      throw createError(400, `Duplicate size: ${item.size}`);
    }
    seen.add(item.size);
  });
  return parsedSizes;
};

export const validateCartItems = async (cartItems) => {
  const productIds = cartItems.map((p) => p.product);

  const productsData = await Product.find({ _id: { $in: productIds } });

  cartItems.forEach((item) => {
    const product = productsData.find(
      (p) => p._id.toString() === item.product.toString(),
    );
    if (!product) {
      throw createError(404, `Product not found: ${item.product}`);
    }
    const variant = product.sizes.find((s) => s.size === item.size);
    if (!variant) {
      throw createError(404, `Size ${item.size} not available`);
    }

    if (item.quantity > variant.stock) {
      throw createError(
        400,
        `Not enough stock for ${product.name} size ${item.size}`,
      );
    }
  });
};

export const validateTransactionAddress = (data) => {
  const { paymentMethod } = data;

  if (!paymentMethod) {
    throw createError(400, "Payment method is required");
  }

  const validPaymentMethod = ["COD", "ONLINE"];
  const checkPaymentMethod = validPaymentMethod.includes(paymentMethod);

  if (!checkPaymentMethod) {
    throw createError(400, "Invalid payment method");
  }
};

export const validateUpdatesData = (data) => {
  const { phone, email } = data;

  if (phone !== undefined) {
    const isValidPhone = validator.isMobilePhone(phone, "en-IN");
    if (!isValidPhone) {
      throw createError(400, "Invalid phone number");
    }
  }

  if (email !== undefined) {
    const isValidEmail = validator.isEmail(email);
    if (!isValidEmail) {
      throw createError(400, "Invalid email address");
    }
  }
};

export const validateAddressDetails = ({
  name,
  phone,
  pincode,
  houseNo,
  street,
  district,
  state,
}) => {
  if (!name || name.trim().length < 2) {
    throw createError(400, "Name must be at least 2 characters");
  }

  if (!phone || !validator.isMobilePhone(phone, "en-IN")) {
    throw createError(400, "Invalid phone number");
  }

  if (!pincode || !validator.isPostalCode(pincode, "IN")) {
    throw createError(400, "Invalid pincode");
  }

  if (!houseNo || houseNo.trim().length < 1) {
    throw createError(400, "House number is required");
  }

  if (!street || street.trim().length < 3) {
    throw createError(400, "Street must be at least 3 characters");
  }

  if (!district || district.trim().length < 2) {
    throw createError(400, "District is required");
  }

  if (!state || state.trim().length < 2) {
    throw createError(400, "State is required");
  }
};
