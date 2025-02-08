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
        Client: null, 
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

const updateProduct = asyncHandler(async (req, res) => {
    const {Title, Description, Price, Category, Quantity, Rating} = req.body;

    if(Title=="" || Description=="" || Price=="" || Category=="" || Quantity=="" || Rating==""){
        throw new ApiError(400,"Atleast one field is required to update");
    }

    const userId = req.user._id;
    const productId = "679e1c8a644ea0bedb2e72b4";//!!!!!!!!!!!!!!!! update it when fontend is ready !!!!!!!!!!!!!!!!!!!!!
    // console.log(userId);
    // console.log(productId);
    if(!userId){
        throw new ApiError(400,"User not found");
    }
    if(!productId){
        throw new ApiError(400,"Product not found");
    }


    const product = await Product.findOneAndUpdate(
        {
            _id:productId,
            Owner:userId
        },
        {
           $set:{ Title:Title,
            Description:Description,
            Price:Price,
            Category:Category,
            Quantity:Quantity,
            Rating:Rating,}

        },
        {
            new:true
        }
    )
    if(!product){
        throw new ApiError(500,"product update failed due to some internal problem")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "product updated successfully"
        )
    )

});

const updateImage = asyncHandler(async (req, res) => {
    // const {productId} = req.body;
    const productId = "679e1c8a644ea0bedb2e72b4";//!!!!!!!!!!!!!!!! update it when fontend is ready !!!!!!!!!!!!!!!!!!!!!
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(400,"User not found");
    }
    if(!productId){
        throw new ApiError(400,"Product not found");
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

    const product = await Product.findOneAndUpdate(
        {
            _id:productId,
            Owner:userId
        },
        {
            $set:{
                Image:Image.secure_url
            }
        },
        {
            new:true
        }
    )
    if(!product){
        throw new ApiError(500,"product update failed due to some internal problem")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "product updated successfully"
        )
    )

});

const deleteProduct = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const productId = "67a24ab5c785b229a56d57e5";//!!!!!!!!!!!!!!!! update it when fontend is ready !!!!!!!!!!!!!!!!!!!!!
    if(!userId){
        throw new ApiError(400,"User not found");
    }
    if(!productId){
        throw new ApiError(400,"Product not found");
    }
    const productOwner = await Product.findOne({_id:productId}).select("Owner");
    console.log(productOwner);
    if (userId !== productOwner.Owner) {
        throw new ApiError(403, "You are not authorized to delete this product");
    }
    const product = await Product.findOneAndDelete(
        {
            _id:productId,
            Owner:userId
        }
    )
    if(!product){
        throw new ApiError(500,"product delete failed due to some internal problem")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "product deleted successfully"
        )
    )

});

const sell = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(400,"User not found");
    }
    const product = await Product.find({Owner:userId});
    if(!product){
        throw new ApiError(500,"product not found due to some internal problem")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "product found successfully"
        )
    )

});
export {registerProduct,
    updateProduct,
    updateImage,
    deleteProduct,
    sell
};