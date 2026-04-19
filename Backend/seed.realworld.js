import mongoose from "mongoose";
import "./config/loadEnv.js";
import { Company } from "./models/company/register.js";
import { JobPost } from "./models/company/job.js";
import { CompanyStats } from "./models/company/stats.js";
import { Student } from "./models/student/register.model.js";
import { Profile } from "./models/student/profile.model.js";

const companies = [
  {
    name: "Tata Consultancy Services",
    domain: "IT Services",
    address: "Bengaluru",
    logoUrl:
      "https://www.tcs.com/content/dam/global-tcs/en/images/who-we-are/media-kit/TCS-logo-black-CMYK.svg",
    email: "campus.hiring@tcs.demo",
  },
  {
    name: "Infosys",
    domain: "Digital Services",
    address: "Mysuru",
    logoUrl:
      "https://www.infosys.com/content/dam/infosys-web/en/global-resource/media-resources/infosys-logo-png.png",
    email: "campus.hiring@infosys.demo",
  },
  {
    name: "Wipro",
    domain: "Consulting",
    address: "Hyderabad",
    logoUrl: "/assets/company-logos/wipro-official.svg",
    email: "earlycareers@wipro.demo",
  },
  {
    name: "Cognizant",
    domain: "Technology",
    address: "Chennai",
    logoUrl:
      "https://mma.prnewswire.com/media/1794711/Cognizant_Logo.jpg?p=facebook",
    email: "fresher.jobs@cognizant.demo",
  },
  {
    name: "Capgemini",
    domain: "Engineering",
    address: "Pune",
    logoUrl:
      "https://www.capgemini.com/wp-content/themes/capgemini2025/assets/images/logo.svg",
    email: "campus@capgemini.demo",
  },
];

const jobs = [
  {
    companyEmail: "campus.hiring@tcs.demo",
    job_title: "Assistant System Engineer",
    job_type: "Full-time",
    salary: "3.6 LPA",
    job_location: "Bengaluru",
    skills: ["Java", "SQL", "OOP"],
    eligibility: {
      minCgpa: 6.5,
      maxBacklogs: 0,
      branches: ["CSE", "IT", "ECE"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "campus.hiring@tcs.demo",
    job_title: "Digital Engineer",
    job_type: "Full-time",
    salary: "7 LPA",
    job_location: "Bengaluru",
    skills: ["JavaScript", "React", "Node.js", "SQL"],
    eligibility: {
      minCgpa: 7.0,
      maxBacklogs: 0,
      branches: ["CSE", "IT"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "campus.hiring@infosys.demo",
    job_title: "Systems Engineer",
    job_type: "Full-time",
    salary: "3.8 LPA",
    job_location: "Mysuru",
    skills: ["Python", "SQL", "Data Structures"],
    eligibility: {
      minCgpa: 6.8,
      maxBacklogs: 0,
      branches: ["CSE", "IT", "ECE", "MECH"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "campus.hiring@infosys.demo",
    job_title: "Specialist Programmer",
    job_type: "Full-time",
    salary: "9.5 LPA",
    job_location: "Mysuru",
    skills: ["Java", "Spring Boot", "Microservices", "SQL"],
    eligibility: {
      minCgpa: 8.0,
      maxBacklogs: 0,
      branches: ["CSE", "IT"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "earlycareers@wipro.demo",
    job_title: "Project Engineer",
    job_type: "Full-time",
    salary: "4.5 LPA",
    job_location: "Hyderabad",
    skills: ["Java", "SQL", "Communication"],
    eligibility: {
      minCgpa: 6.0,
      maxBacklogs: 1,
      branches: ["CSE", "IT", "ECE"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "earlycareers@wipro.demo",
    job_title: "Java Full Stack Trainee",
    job_type: "Full-time",
    salary: "6.5 LPA",
    job_location: "Hyderabad",
    skills: ["Java", "React", "SQL", "HTML"],
    eligibility: {
      minCgpa: 7.0,
      maxBacklogs: 0,
      branches: ["CSE", "IT"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "fresher.jobs@cognizant.demo",
    job_title: "Programmer Analyst Trainee",
    job_type: "Full-time",
    salary: "4 LPA",
    job_location: "Chennai",
    skills: ["Python", "SQL", "Communication"],
    eligibility: {
      minCgpa: 6.5,
      maxBacklogs: 0,
      branches: ["CSE", "IT", "ECE", "MECH"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "fresher.jobs@cognizant.demo",
    job_title: "Data Analyst Fresher",
    job_type: "Full-time",
    salary: "5.8 LPA",
    job_location: "Chennai",
    skills: ["Python", "SQL", "Power BI", "Excel"],
    eligibility: {
      minCgpa: 7.2,
      maxBacklogs: 0,
      branches: ["CSE", "IT", "ECE"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "campus@capgemini.demo",
    job_title: "Graduate Engineer Trainee",
    job_type: "Full-time",
    salary: "4.2 LPA",
    job_location: "Pune",
    skills: ["Java", "Python", "SQL"],
    eligibility: {
      minCgpa: 6.5,
      maxBacklogs: 1,
      branches: ["CSE", "IT", "ECE", "MECH"],
      graduationYears: ["2026"],
    },
  },
  {
    companyEmail: "campus@capgemini.demo",
    job_title: "Cloud and DevOps Analyst",
    job_type: "Full-time",
    salary: "7.5 LPA",
    job_location: "Pune",
    skills: ["AWS", "Docker", "Linux", "Python"],
    eligibility: {
      minCgpa: 7.5,
      maxBacklogs: 0,
      branches: ["CSE", "IT", "ECE"],
      graduationYears: ["2026"],
    },
  },
];

const students = [
  {
    student: {
      fullName: "Ananya Gupta",
      email: "ananya.gupta@campus.demo",
      rollNo: "CSE101",
      branch: "CSE",
      password: "password123",
    },
    profile: {
      department: "CSE",
      cgpa: 8.7,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000001,
      address: "Delhi",
      programmingLanguages: ["Java", "Python", "JavaScript"],
      webTechnologies: ["React", "Node.js", "HTML"],
      databases: ["SQL", "MongoDB"],
      otherSkills: ["OOP", "Data Structures", "Communication"],
      certifications: ["Java Programming Masterclass"],
      linkedin: "https://linkedin.com/in/ananya-gupta",
      github: "https://github.com/ananyagupta",
      resume: "https://example.com/resumes/ananya-gupta.pdf",
      projects: ["Placement Management Portal", "Student CRM"],
    },
  },
  {
    student: {
      fullName: "Rahul Mehta",
      email: "rahul.mehta@campus.demo",
      rollNo: "IT102",
      branch: "IT",
      password: "password123",
    },
    profile: {
      department: "IT",
      cgpa: 7.9,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000002,
      address: "Ahmedabad",
      programmingLanguages: ["Java", "JavaScript"],
      webTechnologies: ["React", "HTML", "CSS"],
      databases: ["SQL"],
      otherSkills: ["Node.js", "Communication", "Git"],
      certifications: ["Full Stack Web Development"],
      linkedin: "https://linkedin.com/in/rahul-mehta",
      github: "https://github.com/rahulmehta",
      resume: "https://example.com/resumes/rahul-mehta.pdf",
      projects: ["Online Assessment System", "Job Portal"],
    },
  },
  {
    student: {
      fullName: "Priya Natarajan",
      email: "priya.natarajan@campus.demo",
      rollNo: "ECE103",
      branch: "ECE",
      password: "password123",
    },
    profile: {
      department: "ECE",
      cgpa: 8.1,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000003,
      address: "Chennai",
      programmingLanguages: ["Python", "C", "Java"],
      webTechnologies: [],
      databases: ["SQL"],
      otherSkills: ["Communication", "Data Structures", "Excel"],
      certifications: ["Python for Everybody"],
      linkedin: "https://linkedin.com/in/priya-natarajan",
      github: "https://github.com/priyanatarajan",
      resume: "https://example.com/resumes/priya-natarajan.pdf",
      projects: ["Smart Parking System", "Sales Insights Dashboard"],
    },
  },
  {
    student: {
      fullName: "Karan Sethi",
      email: "karan.sethi@campus.demo",
      rollNo: "CSE104",
      branch: "CSE",
      password: "password123",
    },
    profile: {
      department: "CSE",
      cgpa: 9.0,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000004,
      address: "Noida",
      programmingLanguages: ["Java", "Python", "Go"],
      webTechnologies: ["Spring Boot", "React"],
      databases: ["SQL", "MongoDB"],
      otherSkills: ["Microservices", "Data Structures", "OOP"],
      certifications: ["Spring Framework Bootcamp"],
      linkedin: "https://linkedin.com/in/karan-sethi",
      github: "https://github.com/karansethi",
      resume: "https://example.com/resumes/karan-sethi.pdf",
      projects: ["Distributed Inventory System", "Campus ERP"],
    },
  },
  {
    student: {
      fullName: "Neha Kulkarni",
      email: "neha.kulkarni@campus.demo",
      rollNo: "IT105",
      branch: "IT",
      password: "password123",
    },
    profile: {
      department: "IT",
      cgpa: 7.4,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000005,
      address: "Pune",
      programmingLanguages: ["Python", "SQL"],
      webTechnologies: [],
      databases: ["SQL"],
      otherSkills: ["Power BI", "Excel", "Communication"],
      certifications: ["Data Analytics Essentials"],
      linkedin: "https://linkedin.com/in/neha-kulkarni",
      github: "https://github.com/nehakulkarni",
      resume: "https://example.com/resumes/neha-kulkarni.pdf",
      projects: ["Placement Analytics Dashboard", "Retail Sales Forecast"],
    },
  },
  {
    student: {
      fullName: "Vikram Desai",
      email: "vikram.desai@campus.demo",
      rollNo: "MECH106",
      branch: "MECH",
      password: "password123",
    },
    profile: {
      department: "MECH",
      cgpa: 7.1,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000006,
      address: "Surat",
      programmingLanguages: ["Python"],
      webTechnologies: [],
      databases: ["SQL"],
      otherSkills: ["Excel", "Communication", "Problem Solving"],
      certifications: ["SQL for Beginners"],
      linkedin: "https://linkedin.com/in/vikram-desai",
      github: "https://github.com/vikramdesai",
      resume: "https://example.com/resumes/vikram-desai.pdf",
      projects: ["Maintenance Tracker", "Production Data Analyzer"],
    },
  },
  {
    student: {
      fullName: "Sana Farooq",
      email: "sana.farooq@campus.demo",
      rollNo: "CSE107",
      branch: "CSE",
      password: "password123",
    },
    profile: {
      department: "CSE",
      cgpa: 8.5,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000007,
      address: "Hyderabad",
      programmingLanguages: ["Python", "JavaScript"],
      webTechnologies: ["React"],
      databases: ["SQL", "MongoDB"],
      otherSkills: ["Node.js", "Power BI", "Communication"],
      certifications: ["Microsoft Power BI Data Analyst"],
      linkedin: "https://linkedin.com/in/sana-farooq",
      github: "https://github.com/sanafarooq",
      resume: "https://example.com/resumes/sana-farooq.pdf",
      projects: ["Recruitment Insights Dashboard", "Attendance Portal"],
    },
  },
  {
    student: {
      fullName: "Arjun Pillai",
      email: "arjun.pillai@campus.demo",
      rollNo: "IT108",
      branch: "IT",
      password: "password123",
    },
    profile: {
      department: "IT",
      cgpa: 8.2,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000008,
      address: "Kochi",
      programmingLanguages: ["Python", "Java"],
      webTechnologies: [],
      databases: ["SQL"],
      otherSkills: ["AWS", "Docker", "Linux", "Communication"],
      certifications: ["AWS Cloud Practitioner"],
      linkedin: "https://linkedin.com/in/arjun-pillai",
      github: "https://github.com/arjunpillai",
      resume: "https://example.com/resumes/arjun-pillai.pdf",
      projects: ["Cloud Cost Monitor", "DevOps Lab Automation"],
    },
  },
  {
    student: {
      fullName: "Ishika Roy",
      email: "ishika.roy@campus.demo",
      rollNo: "ECE109",
      branch: "ECE",
      password: "password123",
    },
    profile: {
      department: "ECE",
      cgpa: 6.9,
      backlogs: 1,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000009,
      address: "Kolkata",
      programmingLanguages: ["Java", "Python"],
      webTechnologies: [],
      databases: ["SQL"],
      otherSkills: ["Communication", "Testing"],
      certifications: ["Core Java Fundamentals"],
      linkedin: "https://linkedin.com/in/ishika-roy",
      github: "https://github.com/ishikaroy",
      resume: "https://example.com/resumes/ishika-roy.pdf",
      projects: ["Inventory Checker", "Lab Report Generator"],
    },
  },
  {
    student: {
      fullName: "Manav Joshi",
      email: "manav.joshi@campus.demo",
      rollNo: "CSE110",
      branch: "CSE",
      password: "password123",
    },
    profile: {
      department: "CSE",
      cgpa: 7.6,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000010,
      address: "Jaipur",
      programmingLanguages: ["Java", "Python", "JavaScript"],
      webTechnologies: ["HTML", "CSS"],
      databases: ["SQL"],
      otherSkills: ["OOP", "Data Structures", "Communication"],
      certifications: ["Data Structures in Java"],
      linkedin: "https://linkedin.com/in/manav-joshi",
      github: "https://github.com/manavjoshi",
      resume: "https://example.com/resumes/manav-joshi.pdf",
      projects: ["Hostel Management System", "Student Feedback App"],
    },
  },
  {
    student: {
      fullName: "Pooja Sharma",
      email: "pooja.sharma@campus.demo",
      rollNo: "IT111",
      branch: "IT",
      password: "password123",
    },
    profile: {
      department: "IT",
      cgpa: 8.8,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000011,
      address: "Indore",
      programmingLanguages: ["Java", "Python"],
      webTechnologies: ["React", "Node.js"],
      databases: ["SQL"],
      otherSkills: ["AWS", "Docker", "Linux", "Communication"],
      certifications: ["AWS Academy Graduate"],
      linkedin: "https://linkedin.com/in/pooja-sharma",
      github: "https://github.com/poojasharma",
      resume: "https://example.com/resumes/pooja-sharma.pdf",
      projects: ["Cloud Resume Challenge", "Helpdesk Portal"],
    },
  },
  {
    student: {
      fullName: "Adarsh Bhat",
      email: "adarsh.bhat@campus.demo",
      rollNo: "MECH112",
      branch: "MECH",
      password: "password123",
    },
    profile: {
      department: "MECH",
      cgpa: 6.6,
      backlogs: 0,
      graduationYear: "2026",
      currentSemester: "8th Semester",
      phone: 9000000012,
      address: "Mangaluru",
      programmingLanguages: ["Python"],
      webTechnologies: [],
      databases: ["SQL"],
      otherSkills: ["Excel", "Communication"],
      certifications: ["Business Communication Skills"],
      linkedin: "https://linkedin.com/in/adarsh-bhat",
      github: "https://github.com/adarshbhat",
      resume: "https://example.com/resumes/adarsh-bhat.pdf",
      projects: ["Plant Maintenance Dashboard"],
    },
  },
];

const buildCriteria = (eligibility) =>
  [
    eligibility.branches.length
      ? `Branches: ${eligibility.branches.join(", ")}`
      : null,
    `Min CGPA: ${eligibility.minCgpa}`,
    `Max Backlogs: ${eligibility.maxBacklogs}`,
    eligibility.graduationYears.length
      ? `Graduation Years: ${eligibility.graduationYears.join(", ")}`
      : null,
  ]
    .filter(Boolean)
    .join(" | ");

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB...");

    console.log("Clearing existing data for real-world campus recruitment seed...");
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
      await JobPost.create({
        companyId: company._id,
        job_title: jobData.job_title,
        job_type: jobData.job_type,
        vacancy: 12,
        salary: jobData.salary,
        job_des: `Campus fresher opportunity for ${jobData.job_title} at ${company.name}.`,
        skills: jobData.skills,
        criteria: buildCriteria(jobData.eligibility),
        eligibility: jobData.eligibility,
        job_location: jobData.job_location,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
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

    console.log("Real-world campus recruitment data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding real-world campus recruitment data:", error);
    process.exit(1);
  }
};

seedDB();
