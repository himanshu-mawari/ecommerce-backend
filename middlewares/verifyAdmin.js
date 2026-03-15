import createError from "../helpers/createError.js";

const verifyAdmin = (req, res, next) => {
  console.log(req.user)
  if (!req.user || req.user.role !== "admin") {
    return next(createError(403, "Access denied : Admins only"));
  }
  next()
};

export default verifyAdmin;
