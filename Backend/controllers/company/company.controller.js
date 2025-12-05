import { Company } from "../../models/company/register.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (companyId)=>{
  try {
    const company  = await Company.findById(companyId)

    const accessToken= await company.generateAccessToken();
    const refreshToken= await company.generateRefreshToken();

    company.refreshToken = refreshToken;
    await company.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
  } catch (error) {
     throw new error 
  }
}

const comRegister = async (req,res)=>{
    try {
    const {name,address,domain,email,password}=req.body;

    const existingCompany = await Company.findOne({ email: email });

    if (existingCompany) {
      return res
      .status(400)
      .json({ message: "Email already exists" });
    }

    const company = await Company.create({
      name,
      address,
      domain,
      email,
      password
    })

    res.status(201).json({
      message: "Registration Succesfull",
      company
    });
  } catch (error) {
      res.status(500).json({ message: "Registration failed" });
  }
}

const comLogin = asyncHandler(async (req,res)=>{
    try {
            const {email,password}=req.body;
        
            if (!email || !password) {
              return res
                .status(400)
                .json({ message: "Email and password are required" });
            }
        
            const company = await Company.findOne({ email: email });
            if (!company) {
              return res.status(400).json({ message: "Invalid email company not found" });
            }
        
            const isPasswordCorrect = await company.isPasswordCorrect(password)
        
            if (!isPasswordCorrect) {
              return res.status(400).json({ message: "Invalid password" });
            }
        
            const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(company._id)
    
            // if(!accessToken || refreshToken){
            //     res.status(501).json({message:"error while genarting token"}) 
            // }
        
            const loggedIncompany = await Company.findById(company._id).select("-password -refreshToken")
        
            res.json({
              message: "Login successful",
              accessToken,
              refreshToken,
              loggedIncompany,
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error logging in" });
          }
})

export {comRegister,comLogin}