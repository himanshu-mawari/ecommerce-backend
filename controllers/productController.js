import createError from "../helpers/createError.js";


export const addProduct = (req , res , next) => {
    try{
        const { name , description  , category , subCategory , price , stockQuantity  } = req.body;

        const image1 = req.files.image1[0]
        const image2 = req.files.image2[0]
        const image3 = req.files.image3[0]
        const image4 = req.files.image4[0]

        console.log(name , description  , category , subCategory , price , stockQuantity )
        console.log(image1 , image2 , image3 , image4);

        res.json({
            message : "Successfully read the req.body and files"
        })
    }catch(err){
        next(err)
    }
}
export const removeProduct = () => {}
export const listProduct = () => {}
export const singleProduct = () => {}