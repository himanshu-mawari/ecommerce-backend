import express from "express";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import { getdashboardData } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/dashboard" , verifyAuth , verifyAdmin , getdashboardData );

export default dashboardRouter;  