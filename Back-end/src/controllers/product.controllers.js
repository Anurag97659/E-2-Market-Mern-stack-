import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse}from '../utils/ApiResponse.js';
import dotenv from "dotenv";
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {Product} from '../models/product.model.js';
dotenv.config({
    path: "/.env"
});

const registerProduct = asyncHandler(async (req, res) => {
    const {Title, Description, Price, Category, Quantity, Rating} = req.body;
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(400,"User not found");
    }
    if(Title===""){
        throw new ApiError(400,"Title is required");
    }
    else if(Description===""){
        throw new ApiError(400,"Description is required");
    }
    else if(Price===""){
        throw new ApiError(400,"Price is required");
    }
    else if(Category===""){
        throw new ApiError(400,"Category is required");
    }
    else if(Quantity===""){
        throw new ApiError(400,"Quantity is required");
    }
    else if(Rating===""){
        throw new ApiError(400,"Rating is required");
    }

    if (!req.files || !req.files.Image || req.files.Image.length === 0) {
        throw new ApiError(400, "Image is required");
    }
    
    
    const ImageLocalpath = req.files?.Image[0]?.path;
    if(!ImageLocalpath){
        throw new ApiError(400,"Image is required");
    }
    const Image = await uploadOnCloudinary(ImageLocalpath);
    if(!Image){
        throw new ApiError(500,"Image upload failed");
    }

    const product = await Product.create({
        Title,
        Description,
        Price,
        Category,
        Quantity,
        Rating,
        Owner: userId,
        Client: "",
        Image: Image.secure_url,
    })
    const createProduct = await Product.findById(product._id);
    if(!createProduct){
        throw new ApiError(500,"product creation failed due to some internal problem")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            createProduct,
            "product created successfully"
        )
    )

});

export {registerProduct};