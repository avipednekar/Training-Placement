import mongoose from "mongoose";

const companySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    address:{
        type:String,
        required:true
    },
    website:{
        type:String
    },
    domain:{
        type:String
    },
    password:{
        type:String
    }
},{timestamps:true})

export const Company=mongoose.model("Company",companySchema);