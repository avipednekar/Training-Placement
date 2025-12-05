import jwt from "jsonwebtoken"
import { Student } from "../models/student/register.model.js";

const verifyJWT = async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        // console.log(token)
    
        if(!token){
            return res 
            .status(401)
            .json(
                400,
                "Token invalid"
            )
        }
    
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const student=await Student.findById(decodeToken?._id).select("-password -refreshToken")
    
        if (!student) {
            return res
            .status(401)
            .json(
                401,
                "invalid access token"
            )
        }
    
        req.student=student;
        next()
    } catch (error) {
        return res
        .status(400)
        .json(
            400,
            error?.message || "Invalid token access"
        )
    }
}

export {verifyJWT}