import {
  loginUser,
  signupUser,
  logout,
} from "../controllers/authController.js";
import express from "express";
import verifyAuth from "../middlewares/verifyAuth.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/signup", signupUser);
authRouter.post("/logout", verifyAuth, logout);

export default authRouter;
