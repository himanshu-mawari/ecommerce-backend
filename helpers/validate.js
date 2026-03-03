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

export const validateProductDetails = ({
  name,
  description,
  category,
  subCategory,
  price,
  stockQuantity
} , reqFiles) => {
  if (!name?.trim()) {
    throw createError(400, "Product name is required");
  } else if (name.trim().length < 3) {
    throw createError(
      400,
      "Product name must be at least contain 3 characters",
    );
  } else if (!description?.trim()) {
    throw createError(400, "Product description is required");
  } else if (!category) {
    throw createError(400, "Category is required");
  } else if (!["Men", "Women", "Kids"].includes(category)) {
    throw createError(400, "Invalid category");
  } else if (!subCategory) {
    throw createError(400, "Sub category is required");
  } else if (price == null || price < 0) {
    throw createError(400, "Invalid price");
  } else if (stockQuantity == null || stockQuantity < 0) {
    throw createError(400, "Invalid stock quantity");
  }
  else if (!reqFiles || Object.keys(reqFiles).length === 0) {
  throw createError(400 ,"At least one image is required" );
}
};
