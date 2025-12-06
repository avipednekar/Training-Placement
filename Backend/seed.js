import mongoose from "mongoose";
import dotenv from "dotenv";
import { Company } from "./models/company/register.js";
import { JobPost } from "./models/company/job.js";

dotenv.config();

const dummyCompanies = [
  { name: "TechNova Solutions", domain: "Fintech", location: "Bangalore" },
  { name: "GreenEarth Energy", domain: "Clean Tech", location: "Pune" },
  { name: "Creative Pixel Studios", domain: "Design", location: "Mumbai" },
  { name: "DataStream Analytics", domain: "Big Data", location: "Hyderabad" },
  { name: "CloudPeak Systems", domain: "Cloud Computing", location: "Chennai" },
];

const jobRoles = [
  {
    title: "Software Engineer",
    type: "Full-time",
    salary: "12 LPA",
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "Data Scientist",
    type: "Full-time",
    salary: "15 LPA",
    skills: ["Python", "TensorFlow", "SQL"],
  },
  {
    title: "UI/UX Designer",
    type: "Contract",
    salary: "8 LPA",
    skills: ["Figma", "Adobe XD", "CSS"],
  },
  {
    title: "Product Manager",
    type: "Full-time",
    salary: "18 LPA",
    skills: ["Agile", "Scrum", "Jira"],
  },
  {
    title: "DevOps Engineer",
    type: "Full-time",
    salary: "14 LPA",
    skills: ["AWS", "Docker", "Kubernetes"],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB...");

    // Clear existing dummy data (optional, relying on unique emails to avoid dups if run multiple times)
    // await Company.deleteMany({ email: { $regex: /@dummy.com/ } });

    for (let i = 0; i < dummyCompanies.length; i++) {
      const compData = dummyCompanies[i];
      const email = `contact@${compData.name
        .replace(/\s+/g, "")
        .toLowerCase()}.dummy.com`;

      let company = await Company.findOne({ email });
      if (!company) {
        company = await Company.create({
          name: compData.name,
          email: email,
          password: "password123", // Will be hashed by pre-save hook
          address: compData.location,
          domain: compData.domain,
        });
        console.log(`Created Company: ${company.name}`);
      } else {
        console.log(`Company exists: ${company.name}`);
      }

      // Create random jobs for this company
      for (let j = 0; j < 3; j++) {
        const role = jobRoles[Math.floor(Math.random() * jobRoles.length)];
        await JobPost.create({
          companyId: company._id,
          job_title: role.title,
          job_type: role.type,
          vacancy: Math.floor(Math.random() * 5) + 1,
          salary: role.salary,
          job_des: `We are looking for a skilled ${role.title} to join our team at ${company.name}.`,
          skills: role.skills,
          criteria: "B.Tech/B.E in CS/IT with min 7.0 CGPA",
          job_location: company.address,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        });
      }
      console.log(`  - Added 3 jobs for ${company.name}`);
    }

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
