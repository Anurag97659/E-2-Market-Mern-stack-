import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import jwt from "jsonwebtoken";
import {ApiResponse}from '../utils/ApiResponse.js';
import dotenv from "dotenv";
dotenv.config({
    path: "/.env"
});
const registeruser = asyncHandler(async (req, res) => {
    const { username, email, password,fullname } = req.body;
    if(fullname===""){
        throw new ApiError(400,"fullname is required");
    }
    else if (password === "") {
        throw new ApiError(400, "password is required");
    }
    else if (email === "") {
        throw new ApiError(400, "email is required");
    }
    else if (username === "") {
        throw new ApiError(400, "username is required");
    }


   const checkingUserExistance= await  User.findOne({
        $or: [{  email }, {  username }]
    })
    if(checkingUserExistance){
        throw new ApiError(409,"user or email already exists");
    }

    const user =  await User.create({ username,email,password,fullname });
    const createUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createUser){throw new ApiError(500,"user creation failed due to some internal problem")}

    return res.status(200).json(
        new ApiResponse(
            200,
            createUser,
            "user created successfully"
        )
    )
});

const generateAccessTokenandRefreshToken = async(userid)=>{
    try{
        const user=await User.findById(userid);
        const accessToken = user.generateAccessToken() 
        const refreshToken = user.generateRefreshToken()
        user.refreshToken=refreshToken; 
        await user.save({validateBeforeSave:false});
        return{accessToken,refreshToken};
    }
    catch(error){
        throw new ApiError(500,`token generation failed while generating access token and refresh token ${error.message}`);
    }
}


const loginuser = asyncHandler(async (req, res) => {

    const {email,username,password} = req.body;

    if(!email && !username){
        throw new ApiError(400,"email or username is required");
    }

    const user= await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new ApiError(404,"user not found");
    }
 
    const ispasswordright= await user.isPasswordCorrect(password);
    if(!ispasswordright){
        throw new ApiError(401,"password is incorrect");
    }

    const {accessToken,refreshToken} = await generateAccessTokenandRefreshToken(user._id);
    const loggeduser = await User.findById(user._id).select("-password -refreshToken"); 
    const options ={ 
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)  
    .cookie("refreshToken",refreshToken,options)
    .json(
       
        new ApiResponse(
        200,
        {
            user:loggeduser,
            accessToken,
            refreshToken
        },
        "user logged in successfully"
        )
    ) 
});


const logoutuser =asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(  
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true 
        }
    )

    const options ={ 
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user logged out successfully")
    )
    
})


const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const{oldPassword,newPassword,confirmPassword}=req.body
    if(newPassword != confirmPassword){
        throw new ApiError(401,"new password and confirm password are different")
    }
    const user =  await User.findById(req.user?._id)
    const isPasswordCorrect =  await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(401,"wrong old password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password Changed Successfully OOO YEAH !!"
        )
    )
})


const upateDetails = asyncHandler(async(req,res)=>{
    const { username, email, fullname } = req.body;
    if(! username && ! email && ! fullname){
        throw new ApiError(400," username and email is required");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {$set:{
            username:username,
            email:email,
            fullname:fullname
        }},
        {new: true}
    ).select("-password")
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "DETAILS UPDATED SUCCESSFULLY :)"
        )
    )
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"unathorized request");
    }
    try {
        const decodedtoken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)    
        const user =  User.findById(decodedtoken?._id)
        if(!user){
            throw new ApiError(401,"user not found by refresh token")
        }
        if(incomingRefreshToken != user?.refreshToken){
            throw new ApiError(400," refresh token does not match -> Invalid refresh token ")
        }
        // now updating the tokens
        const option = {
            httpOnly:true,
            secure:true
        }
        const {accessToken,newrefreshToken}= await generateAccessTokenandRefreshToken(user._id);
        return res.
        status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",newrefreshToken,option)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken:newrefreshToken
                },
                " access token updated"
            )
        )
    } catch (error) {
        throw new ApiError(400,`INVALID REFRESH TOKEN ${error.message} `)
    }

})  

export{
    registeruser,
    loginuser,
    logoutuser,
    changeCurrentPassword,
    upateDetails,
    refreshAccessToken
}
