import validator from "validator";
import createError from "./createError.js";


export const validateSignupDetails = ({name , email , password}) => {
    if(!name || name.trim().length < 3 ){
        throw createError(400 , "Name must be at least contain 3 characters")
    }
    else if (!email || !validator.isEmail(email)){
        throw createError(400 , "Invalid email address")
    }else if(!password || !validator.isStrongPassword(password)){
        throw createError(400 , "Password must contain uppercase , lowercase , number and symbol ")
    }else if(password.length < 6){
        throw createError(400 , "Password must be at least 6 digit")
    }
};
