import express from "express";
import { getUserData , updateUserData , addWishlistProduct} from "../controllers/userController.js";
import verifyAuth from "../middlewares/verifyAuth.js";

const userRouter = express.Router();

userRouter.get("/profile" , verifyAuth , getUserData)
userRouter.patch("/profile/update" , verifyAuth , updateUserData)
userRouter.post("/wishlist/items" , verifyAuth , addWishlistProduct)

export default userRouter;
