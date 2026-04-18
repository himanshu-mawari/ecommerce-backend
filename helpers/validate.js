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
  if (!["Men", "Women", "Kids"].includes(category)) {
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
  const { paymentMethod, shippingAddress } = data;

  if (!paymentMethod) {
    throw createError(400, "Payment method is required");
  }

  const validPaymentMethod = ["COD", "ONLINE"];
  const checkPaymentMethod = validPaymentMethod.includes(paymentMethod);

  if (!checkPaymentMethod) {
    throw createError(400, "Invalid payment method");
  }

  if (!shippingAddress) {
    throw createError(400, "Shipping address is required");
  }

  const requriedFields = ["street", "state", "city", "postalCode", "country"];
  for (const field of requriedFields) {
    if (!shippingAddress[field]) {
      throw createError(400, `${field} is required`);
    } else if (typeof shippingAddress[field] !== "string") {
      throw new Error(`${field} must be a string`);
    }
  }
};

export const validateUpdatesData = (data) => {
  const { phone, email } = data;
  const checkPhoneNumber = validator.isMobilePhone(phone);
  const checkEmail = validator.isEmail(email);

  if (!checkPhoneNumber) {
    throw createError(400, "Invalid phone number");
  }

  if (!checkEmail) {
    throw createError(400, "Invalid email address");
  }
};
