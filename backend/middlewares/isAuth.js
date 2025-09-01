import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'

const isAthenticated = asyncHandler(async (req,res, next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: "User not Aunthenticated",
            success:false
        })
    }

    const decode = await jwt(verify(token,process.env.SECRET_KEY));
    if(!decode){
        return res.status(401).json({
            message:"invalid Token",
            success:false
        })
    }

    req.id = decode.userId;
    next()
})

export default isAthenticated;