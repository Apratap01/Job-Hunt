import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNumber, password, role } = req.body;

  if (!fullname || !email || !phoneNumber || !password || !role) {
    return res.status(400).json({
      message: "All fields must be filled",
      success: false,
    });
  }

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "User already registered",
      success: false,
    });
  }

  const hashPass = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullname,
    email,
    phoneNumber,
    password: hashPass,
    role,
  });

  const createdUser = await User.findById(newUser._id).select("-password -profile");

  if (!createdUser) {
    return res.status(500).json({
      message: "Something went wrong while registering",
      success: false,
    });
  }

  return res.status(201).json({
    user: createdUser,
    message: "User created successfully",
    success: true,
  });
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      message: "All fields must be filled",
      success: false,
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Account is not registered",
      success: false,
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Password is incorrect",
      success: false,
    });
  }

  if (user.role !== role) {
    return res.status(400).json({
      message: "Account does not exist with current role",
      success: false,
    });
  }

  const tokenData = { userId: user._id };
  const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

  const { password: _, ...loginUser } = user._doc;

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, 
    })
    .json({
      message: `Welcome Back ${user.fullname}`,
      user: loginUser,
      success: true,
    });
});

export const logout = asyncHandler(async(req,res) => {
    return res.status(200).cookie("token","",{maxAge:0}).json({
      message:"Logged Out Successfully",
      success:true
    })
})

export const updateProfile = asyncHandler(async(req,res)=>{
    const {fullname, email, phoneNumber, bio, skills} = req.body
    const file = req.file
  //   if (!fullname || !email || !phoneNumber || !bio || !skills) {
  //   return res.status(400).json({
  //     message: "All fields must be filled",
  //     success: false,
  //   });
  // }

  let skillsArray
  if(skills)
  {
    skillsArray = skills.split(",");

  }
  const userId = req.id;
  let user = await User.findById(userId)

  if(!user){
    return res.status(400).json({
      message:"User not Found",
      success:false
    })
  }

  user.fullname = fullname;
  user.email = email;
  user.phoneNumber = phoneNumber;
  user.profile.skills = skillsArray;
  user.profile.bio = bio;

  await user.save();

  const { password: _, ...loginUser } = user._doc;

  return res.status(200).json({
    message:"Profile Updated Successfully",
    user:loginUser,
    success:true
  })

})