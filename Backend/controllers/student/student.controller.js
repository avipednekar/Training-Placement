import { Profile } from "../../models/student/profile.model.js";
import { Student } from "../../models/student/register.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (studentId)=>{
  try {
    const student  = await Student.findById(studentId)

    const accessToken= await student.generateAccessToken();
    const refreshToken= await student.generateRefreshToken();

    // console.log(accessToken)

    student.refreshToken = refreshToken;
    await student.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
  } catch (error) {
     return error 
  }
}

const studLogin=asyncHandler(async (req,res)=>{
    try {
        const {email,password}=req.body;
    
        if (!email || !password) {
          return res
            .status(400)
            .json({ message: "Email and password are required" });
        }
    
        const student = await Student.findOne({ email: email });
        if (!student) {
          return res.status(400).json({ message: "Invalid email user not found" });
        }
    
        const isPasswordCorrect = await student.isPasswordCorrect(password)
    
        if (!isPasswordCorrect) {
          return res.status(400).json({ message: "Invalid password" });
        }
    
        const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(student._id)

        // if(!accessToken || refreshToken){
        //     res.status(501).json({message:"error while genarting token"}) 
        // }
    
        const loggedInuser = await Student.findById(student._id).select("-password -refreshToken")

        const options = {
          httpOnly:true,
          secure:true
        } 
    
        return res
        .status(201)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json({
          message: "Login successful",
          accessToken,
          refreshToken,
          loggedInuser,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
      }
})

const studRegister = async (req,res)=>{
    try {
        
        if (!req.body) {
          return res.status(400).json({ message: "Request body is missing" });
        }
    
        const {fullName,email,rollNo,branch,password}=req.body;
    
        const existingStudent = await Student.findOne({ email: email});
    
        if (existingStudent) {
          return res.status(400).json({ message: "Email already exists" });
        }
    
        const student=await Student.create({
          fullName,
          email,
          rollNo,
          branch,
          password
        })
    
        const createdStudent= await Student.findById(student._id).select("-password -refreshToken")
    
        if(!createdStudent){
          return res.status(500).json({message:"Error while registering"}) 
        }
    
        return res
        .status(201)
        .json({
          message: "Registration successful",
          createdStudent
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering student" });
      }
}

const studProfile = asyncHandler(async (req,res)=>{
    try {
        const { ...rest } = req.body;

      const updateFields = {};
      for (const key in rest) {
        if (rest[key] !== undefined && rest[key] !== null) {
          updateFields[key] = rest[key];
        }
      }

        const student = req.student;
        
        const updatedProfile = await Profile.findByIdAndUpdate(
          student?._id,
          {
            $set:updateFields
          },
          {
            new:true,runValidators:true,upsert:true
          }
        );

        return res
        .status(200)
        .json({
          message:"Profile updated successfully",
          profile:updatedProfile
        })
    } catch (error) {
        res.status(500).json({ 
        message: "Error saving profile",
        error: error.message 
        });
    }
})

export {
    studRegister,
    studLogin,
    studProfile
}