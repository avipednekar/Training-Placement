import mongoose from "mongoose";
import "./config/loadEnv.js";
import { Company } from "./models/company/register.js";
import { JobPost } from "./models/company/job.js";
import { CompanyStats } from "./models/company/stats.js";
import { Student } from "./models/student/register.model.js";
import { Profile } from "./models/student/profile.model.js";

const companies = [
  {
    name: "TechNova Solutions",
    domain: "Fintech",
    address: "Bangalore",
    email: "hiring@technova.com",
  },
  {
    name: "DataStream Analytics",
    domain: "Big Data",
    address: "Hyderabad",
    email: "careers@datastream.com",
  },
  {
    name: "CloudPeak Systems",
    domain: "Cloud Computing",
    address: "Chennai",
    email: "jobs@cloudpeak.com",
  },
  {
    name: "Creative Pixel Studios",
    domain: "Design",
    address: "Mumbai",
    email: "talent@creativepixel.com",
  },
];

const jobs = [
  {
    companyEmail: "hiring@technova.com",
    job_title: "Software Engineer",
    job_type: "Full-time",
    salary: "12 LPA",
    job_location: "Bangalore",
    skills: ["React", "Node.js", "MongoDB"],
    eligibility: {
      minCgpa: 7.2,
      maxBacklogs: 0,
      branches: ["CSE", "IT"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "hiring@technova.com",
    job_title: "Frontend Developer Intern",
    job_type: "Internship",
    salary: "35k/month",
    job_location: "Bangalore",
    skills: ["React", "JavaScript", "CSS"],
    eligibility: {
      minCgpa: 6.8,
      maxBacklogs: 1,
      branches: ["CSE", "IT", "ECE"],
      graduationYears: ["2026", "2027"],
    },
  },
  {
    companyEmail: "careers@datastream.com",
    job_title: "Data Scientist",
    job_type: "Full-time",
    salary: "15 LPA",
    job_location: "Hyderabad",
    skills: ["Python", "SQL", "TensorFlow"],
    eligibility: {
      minCgpa: 7.8,
      maxBacklogs: 0,
      branches: ["CSE", "IT", "ECE"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "careers@datastream.com",
    job_title: "Business Analyst",
    job_type: "Full-time",
    salary: "10 LPA",
    job_location: "Hyderabad",
    skills: ["SQL", "Excel", "Power BI"],
    eligibility: {
      minCgpa: 7.0,
      maxBacklogs: 1,
      branches: ["CSE", "IT", "ECE", "MECH"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "jobs@cloudpeak.com",
    job_title: "DevOps Engineer",
    job_type: "Full-time",
    salary: "14 LPA",
    job_location: "Chennai",
    skills: ["AWS", "Docker", "Kubernetes"],
    eligibility: {
      minCgpa: 7.5,
      maxBacklogs: 0,
      branches: ["CSE", "IT"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "jobs@cloudpeak.com",
    job_title: "Cloud Support Associate",
    job_type: "Full-time",
    salary: "8 LPA",
    job_location: "Chennai",
    skills: ["Linux", "Networking", "AWS"],
    eligibility: {
      minCgpa: 6.5,
      maxBacklogs: 1,
      branches: ["CSE", "IT", "ECE"],
      graduationYears: ["2026", "2027"],
    },
  },
  {
    companyEmail: "talent@creativepixel.com",
    job_title: "UI/UX Designer",
    job_type: "Full-time",
    salary: "9 LPA",
    job_location: "Mumbai",
    skills: ["Figma", "Adobe XD", "CSS"],
    eligibility: {
      minCgpa: 6.8,
      maxBacklogs: 1,
      branches: ["CSE", "IT", "ECE"],
      graduationYears: ["2026", "2027"],
    },
  },
  {
    companyEmail: "talent@creativepixel.com",
    job_title: "Product Designer Intern",
    job_type: "Internship",
    salary: "30k/month",
    job_location: "Mumbai",
    skills: ["Figma", "Wireframing", "Prototyping"],
    eligibility: {
      minCgpa: 6.5,
      maxBacklogs: 2,
      branches: ["CSE", "IT", "ECE", "MECH"],
      graduationYears: ["2026", "2027"],
    },
  },
];

const students = [
  {
    student: {
      fullName: "Aarav Sharma",
      email: "aarav.sharma@demo.com",
      rollNo: "CSE001",
      branch: "CSE",
      password: "password123",
    },
    profile: {
      department: "CSE",
      cgpa: 8.9,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "7th Semester",
      phone: 9876500001,
      address: "Bangalore",
      programmingLanguages: ["JavaScript", "Python", "Java"],
      webTechnologies: ["React", "Node.js", "CSS"],
      databases: ["MongoDB", "MySQL"],
      otherSkills: ["Git", "REST APIs"],
      certifications: ["AWS Cloud Practitioner"],
      linkedin: "https://linkedin.com/in/aarav-sharma",
      github: "https://github.com/aaravsharma",
      resume: "https://example.com/resumes/aarav-sharma.pdf",
      projects: ["Placement Portal", "Expense Tracker"],
    },
  },
  {
    student: {
      fullName: "Diya Nair",
      email: "diya.nair@demo.com",
      rollNo: "IT014",
      branch: "IT",
      password: "password123",
    },
    profile: {
      department: "IT",
      cgpa: 8.4,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "7th Semester",
      phone: 9876500002,
      address: "Hyderabad",
      programmingLanguages: ["Python", "SQL", "JavaScript"],
      webTechnologies: ["React"],
      databases: ["PostgreSQL", "MongoDB"],
      otherSkills: ["Power BI", "Data Analysis"],
      certifications: ["Google Data Analytics"],
      linkedin: "https://linkedin.com/in/diya-nair",
      github: "https://github.com/diyanair",
      resume: "https://example.com/resumes/diya-nair.pdf",
      projects: ["Sales Dashboard", "Customer Churn Model"],
    },
  },
  {
    student: {
      fullName: "Rohan Verma",
      email: "rohan.verma@demo.com",
      rollNo: "CSE021",
      branch: "CSE",
      password: "password123",
    },
    profile: {
      department: "CSE",
      cgpa: 7.6,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "7th Semester",
      phone: 9876500003,
      address: "Chennai",
      programmingLanguages: ["Python", "Go", "Java"],
      webTechnologies: ["Node.js"],
      databases: ["MySQL"],
      otherSkills: ["Docker", "Kubernetes", "AWS", "Linux"],
      certifications: ["AWS Solutions Architect Associate"],
      linkedin: "https://linkedin.com/in/rohan-verma",
      github: "https://github.com/rohanverma",
      resume: "https://example.com/resumes/rohan-verma.pdf",
      projects: ["K8s Cluster Monitor", "Cloud Cost Tracker"],
    },
  },
  {
    student: {
      fullName: "Meera Iyer",
      email: "meera.iyer@demo.com",
      rollNo: "ECE007",
      branch: "ECE",
      password: "password123",
    },
    profile: {
      department: "ECE",
      cgpa: 7.9,
      backlogs: 1,
      graduationYear: "2026",
      currentSemester: "7th Semester",
      phone: 9876500004,
      address: "Mumbai",
      programmingLanguages: ["JavaScript", "C++"],
      webTechnologies: ["CSS", "HTML"],
      databases: ["MySQL"],
      otherSkills: ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
      certifications: ["UI/UX Design Fundamentals"],
      linkedin: "https://linkedin.com/in/meera-iyer",
      github: "https://github.com/meera-iyer",
      resume: "https://example.com/resumes/meera-iyer.pdf",
      projects: ["Campus Event App Design", "Portfolio Website"],
    },
  },
  {
    student: {
      fullName: "Kabir Singh",
      email: "kabir.singh@demo.com",
      rollNo: "IT032",
      branch: "IT",
      password: "password123",
    },
    profile: {
      department: "IT",
      cgpa: 6.9,
      backlogs: 1,
      graduationYear: "2027",
      currentSemester: "5th Semester",
      phone: 9876500005,
      address: "Bangalore",
      programmingLanguages: ["JavaScript", "TypeScript"],
      webTechnologies: ["React", "CSS", "HTML"],
      databases: ["MongoDB"],
      otherSkills: ["Git", "UI Testing"],
      certifications: ["Frontend Development Bootcamp"],
      linkedin: "https://linkedin.com/in/kabir-singh",
      github: "https://github.com/kabirsingh",
      resume: "https://example.com/resumes/kabir-singh.pdf",
      projects: ["Student Forum", "Task Planner"],
    },
  },
  {
    student: {
      fullName: "Sneha Reddy",
      email: "sneha.reddy@demo.com",
      rollNo: "CSE033",
      branch: "CSE",
      password: "password123",
    },
    profile: {
      department: "CSE",
      cgpa: 9.1,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "7th Semester",
      phone: 9876500006,
      address: "Hyderabad",
      programmingLanguages: ["Python", "R", "SQL"],
      webTechnologies: ["Streamlit"],
      databases: ["PostgreSQL"],
      otherSkills: ["Machine Learning", "TensorFlow", "Power BI"],
      certifications: ["TensorFlow Developer Certificate"],
      linkedin: "https://linkedin.com/in/sneha-reddy",
      github: "https://github.com/snehareddy",
      resume: "https://example.com/resumes/sneha-reddy.pdf",
      projects: ["Demand Forecasting", "Fraud Detection Model"],
    },
  },
  {
    student: {
      fullName: "Aditya Rao",
      email: "aditya.rao@demo.com",
      rollNo: "MECH011",
      branch: "MECH",
      password: "password123",
    },
    profile: {
      department: "MECH",
      cgpa: 7.3,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "7th Semester",
      phone: 9876500007,
      address: "Pune",
      programmingLanguages: ["Python"],
      webTechnologies: [],
      databases: ["Excel"],
      otherSkills: ["Power BI", "Business Analysis", "Presentation"],
      certifications: ["Business Analyst Essentials"],
      linkedin: "https://linkedin.com/in/aditya-rao",
      github: "https://github.com/adityarao",
      resume: "https://example.com/resumes/aditya-rao.pdf",
      projects: ["Manufacturing KPI Dashboard"],
    },
  },
  {
    student: {
      fullName: "Ishita Kapoor",
      email: "ishita.kapoor@demo.com",
      rollNo: "ECE019",
      branch: "ECE",
      password: "password123",
    },
    profile: {
      department: "ECE",
      cgpa: 8.1,
      backlogs: 0,
      graduationYear: "2027",
      currentSemester: "5th Semester",
      phone: 9876500008,
      address: "Chennai",
      programmingLanguages: ["Python", "C"],
      webTechnologies: [],
      databases: [],
      otherSkills: ["Linux", "Networking", "AWS"],
      certifications: ["AWS Academy Cloud Foundations"],
      linkedin: "https://linkedin.com/in/ishita-kapoor",
      github: "https://github.com/ishitakapoor",
      resume: "https://example.com/resumes/ishita-kapoor.pdf",
      projects: ["IoT Monitoring Dashboard"],
    },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB...");

    console.log("Clearing existing data for a fresh seed...");
    await Promise.all([
      CompanyStats.deleteMany({}),
      JobPost.deleteMany({}),
      Profile.deleteMany({}),
      Student.deleteMany({}),
      Company.deleteMany({}),
    ]);

    const companyMap = new Map();
    for (const companyData of companies) {
      const company = await Company.create({
        ...companyData,
        password: "password123",
      });
      companyMap.set(company.email, company);
      console.log(`Created Company: ${company.name}`);
    }

    for (const jobData of jobs) {
      const company = companyMap.get(jobData.companyEmail);
      const criteria = [
        jobData.eligibility.branches.length
          ? `Branches: ${jobData.eligibility.branches.join(", ")}`
          : null,
        `Min CGPA: ${jobData.eligibility.minCgpa}`,
        `Max Backlogs: ${jobData.eligibility.maxBacklogs}`,
        jobData.eligibility.graduationYears.length
          ? `Graduation Years: ${jobData.eligibility.graduationYears.join(", ")}`
          : null,
      ]
        .filter(Boolean)
        .join(" | ");

      await JobPost.create({
        companyId: company._id,
        job_title: jobData.job_title,
        job_type: jobData.job_type,
        vacancy: 4,
        salary: jobData.salary,
        job_des: `Join ${company.name} as a ${jobData.job_title} and work on live industry projects.`,
        skills: jobData.skills,
        criteria,
        eligibility: jobData.eligibility,
        job_location: jobData.job_location,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      });
      console.log(`Created Job: ${jobData.job_title} for ${company.name}`);
    }

    for (const entry of students) {
      const student = await Student.create(entry.student);
      await Profile.create({
        student: student._id,
        ...entry.profile,
      });
      console.log(`Created Student + Profile: ${student.fullName}`);
    }

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
