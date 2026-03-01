import createError from "../helpers/createError.js";
import User from "../models/user.js";


export const loginUser = async (req , res , next) => {
    try{

        const {email , password} = req.body;
        
        const user = await User.findOne({email});
        if(!user){
            next(createError(401 , "Invalid credentials"))
        }
        
        const isCorrectPassword = await verifyPassword(password);
        if(!isCorrectPassword){
            next(createError(401 , "Invalid credentials"))
        }
        
        res.json({
            message : "Successfully logged-in",
        })
    } catch (err) {
        next(err)
    }
}


