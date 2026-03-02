import {loginUser , signupUser } from "../controllers/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login" , loginUser);
authRouter.post("/signup" , signupUser);


export default authRouter;



