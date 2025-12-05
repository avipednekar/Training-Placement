import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", 
    },
    imageUrl: {
      type:String
    },
    department: {
      type:String
    },
    cgpa: Number,
    backlogs: Number,
    projects: [String],
    programmingLanguages: [String],
    webTechnologies: [String],
    databases: [String],
    otherSkills: [String],
    phone: Number,
    address: String,
    linkedin: String,
    github: String,
    resume: {
        type:String
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile",profileSchema)