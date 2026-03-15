import validator from "validator";
import createError from "./createError.js";

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
