import {loginUser } from "../controllers/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login" , loginUser);


export default authRouter;



