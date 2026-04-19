import { JobPost } from "../models/company/job.js";
import { CompanyStats } from "../models/company/stats.js";
import { Student } from "../models/student/register.model.js";
import { Profile } from "../models/student/profile.model.js";

const MIN_SHORTLIST_SKILL_MATCH_PERCENTAGE = 51;

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const toTitleCase = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const normalizeBranch = (value) => {
  const normalized = normalizeText(value);

  const aliases = {
    cse: "CSE",
    "computer science": "CSE",
    "computer science engineering": "CSE",
    it: "IT",
    "information technology": "IT",
    ece: "ECE",
    "electronics and communication engineering": "ECE",
    electronics: "ECE",
    mech: "MECH",
    mechanical: "MECH",
    "mechanical engineering": "MECH",
  };

  return aliases[normalized] || String(value || "").trim().toUpperCase();
};

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sanitizeStringList = (values, formatter = toTitleCase) => {
  if (!Array.isArray(values)) {
    return [];
  }

  return [...new Set(values.map((item) => formatter(item)).filter(Boolean))];
};

const sanitizeEligibility = (eligibility = {}) => ({
  minCgpa: parseNumber(eligibility.minCgpa, 0),
  maxBacklogs: parseNumber(eligibility.maxBacklogs, 99),
  branches: sanitizeStringList(eligibility.branches, normalizeBranch),
  graduationYears: sanitizeStringList(
    eligibility.graduationYears,
    (value) => String(value || "").trim()
  ),
});

const buildCriteriaSummary = (eligibility, skills = []) => {
  const summary = [];

  if (eligibility.branches.length) {
    summary.push(`Branches: ${eligibility.branches.join(", ")}`);
  }

  if (eligibility.minCgpa > 0) {
    summary.push(`Min CGPA: ${eligibility.minCgpa}`);
  }

  if (eligibility.maxBacklogs < 99) {
    summary.push(`Max Backlogs: ${eligibility.maxBacklogs}`);
  }

  if (eligibility.graduationYears.length) {
    summary.push(`Graduation Years: ${eligibility.graduationYears.join(", ")}`);
  }

  if (skills.length) {
    summary.push(`Preferred Skills: ${skills.join(", ")}`);
  }

  return summary.join(" | ");
};

const getStudentSkillSet = (profile) => {
  const buckets = [
    profile?.programmingLanguages,
    profile?.webTechnologies,
    profile?.databases,
    profile?.otherSkills,
    profile?.certifications,
  ];

  return new Set(
    buckets
      .flat()
      .map((skill) => normalizeText(skill))
      .filter(Boolean)
  );
};

const evaluateStudentEligibility = ({ job, student, profile }) => {
  const eligibility = sanitizeEligibility(job.eligibility);
  const studentBranch = normalizeBranch(profile?.department || student?.branch);
  const studentCgpa = Number(profile?.cgpa);
  const studentBacklogs = Number(profile?.backlogs ?? 0);
  const studentGraduationYear = String(profile?.graduationYear || "").trim();

  const reasons = [];

  if (
    eligibility.branches.length &&
    !eligibility.branches.includes(studentBranch)
  ) {
    reasons.push("Branch does not match the job criteria");
  }

  if (
    eligibility.minCgpa > 0 &&
    (!Number.isFinite(studentCgpa) || studentCgpa < eligibility.minCgpa)
  ) {
    reasons.push("CGPA is below the minimum requirement");
  }

  if (
    eligibility.maxBacklogs < 99 &&
    (!Number.isFinite(studentBacklogs) ||
      studentBacklogs > eligibility.maxBacklogs)
  ) {
    reasons.push("Backlogs exceed the allowed limit");
  }

  if (
    eligibility.graduationYears.length &&
    !eligibility.graduationYears.includes(studentGraduationYear)
  ) {
    reasons.push("Graduation year does not match the job criteria");
  }

  const requiredSkills = sanitizeStringList(job.skills, toTitleCase);
  const studentSkillSet = getStudentSkillSet(profile);
  const matchedSkills = requiredSkills.filter((skill) =>
    studentSkillSet.has(normalizeText(skill))
  );
  const missingSkills = requiredSkills.filter(
    (skill) => !studentSkillSet.has(normalizeText(skill))
  );

  const skillMatchPercentage = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 100;

  if (requiredSkills.length && skillMatchPercentage < MIN_SHORTLIST_SKILL_MATCH_PERCENTAGE) {
    reasons.push(
      `Skill match is below the shortlist threshold of ${MIN_SHORTLIST_SKILL_MATCH_PERCENTAGE}%`
    );
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
    matchedSkills,
    missingSkills,
    skillMatchPercentage,
    profileSnapshot: {
      cgpa: Number.isFinite(studentCgpa) ? studentCgpa : null,
      backlogs: Number.isFinite(studentBacklogs) ? studentBacklogs : null,
      graduationYear: studentGraduationYear || null,
      branch: studentBranch || student?.branch || null,
    },
  };
};

export const getCompanyJobsForId = async (companyId) => {
  return JobPost.find({ companyId }).sort({ createdAt: -1 });
};

export const createOrUpdateCompanyJob = async (companyId, payload) => {
  const {
    _id,
    job_title,
    job_type,
    vacancy,
    salary,
    job_des,
    skills,
    criteria,
    job_location,
    deadline,
  } = payload;

  const sanitizedSkills = sanitizeStringList(skills, toTitleCase);
  const sanitizedEligibility = sanitizeEligibility(payload.eligibility);

  const jobData = {
    job_title,
    job_type,
    vacancy,
    salary,
    job_des,
    skills: sanitizedSkills,
    criteria:
      criteria || buildCriteriaSummary(sanitizedEligibility, sanitizedSkills),
    eligibility: sanitizedEligibility,
    job_location,
    deadline,
    companyId,
    updatedAt: new Date(),
  };

  if (_id) {
    const updatedJob = await JobPost.findOneAndUpdate(
      { _id, companyId },
      { $set: jobData },
      { new: true }
    );
    return { job: updatedJob, isUpdate: true };
  }

  const newJob = new JobPost({
    ...jobData,
    createdAt: new Date(),
    applications: 0,
  });

  await newJob.save();

  await CompanyStats.findOneAndUpdate(
    { companyId },
    {
      $inc: { totalJobsPosted: 1, activeJobs: 1 },
      $set: { lastUpdated: new Date() },
    },
    { upsert: true, new: true }
  );

  return { job: newJob, isUpdate: false };
};

export const deleteCompanyJob = async (companyId, jobId) => {
  await JobPost.findByIdAndDelete(jobId);

  await CompanyStats.findOneAndUpdate(
    { companyId },
    {
      $inc: { activeJobs: -1 },
      $set: { lastUpdated: new Date() },
    }
  );
};

export const findJobById = async (jobId) => {
  return JobPost.findById(jobId);
};

export const findPublicJobById = async (jobId) => {
  return JobPost.findById(jobId).populate("companyId", "name").lean();
};

export const getPublicJobsList = async (limit = 0) => {
  let query = JobPost.find({ status: { $ne: "Closed" } })
    .sort({ createdAt: -1 })
    .populate("companyId", "name");

  if (limit > 0) {
    query = query.limit(limit);
  }

  return query;
};

export const getActiveJobCount = async () => {
  return JobPost.countDocuments({ status: { $ne: "Closed" } });
};

export const applyForJob = async (studentId, jobId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const job = await JobPost.findById(jobId);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  const updatedJob = await JobPost.findOneAndUpdate(
    { _id: jobId },
    { $inc: { applications: 1 } },
    { new: true }
  );

  return updatedJob;
};

export const getEligibleStudentsForJob = async (companyId, jobId) => {
  const job = await JobPost.findOne({ _id: jobId, companyId }).populate(
    "companyId",
    "name"
  );

  if (!job) {
    const error = new Error("Job not found for this company");
    error.statusCode = 404;
    throw error;
  }

  const profiles = await Profile.find({})
    .populate("student", "fullName email rollNo branch")
    .lean();

  const eligibleStudents = buildEligibleStudentsForJob(job, profiles);

  return {
    job: {
      _id: job._id,
      title: job.job_title,
      companyName: job.companyId?.name || "Company",
      eligibility: sanitizeEligibility(job.eligibility),
      skills: sanitizeStringList(job.skills, toTitleCase),
      criteria: job.criteria,
    },
    shortlistRules: {
      minSkillMatchPercentage: MIN_SHORTLIST_SKILL_MATCH_PERCENTAGE,
    },
    eligibleStudents,
  };
};

const toShortlistedStudent = (student, profile, evaluation) => ({
  studentId: student._id,
  fullName: student.fullName,
  email: student.email,
  rollNo: student.rollNo,
  branch:
    evaluation.profileSnapshot.branch || profile.department || student.branch,
  cgpa: evaluation.profileSnapshot.cgpa,
  backlogs: evaluation.profileSnapshot.backlogs,
  graduationYear: evaluation.profileSnapshot.graduationYear,
  phone: profile.phone || null,
  linkedin: profile.linkedin || "",
  github: profile.github || "",
  resume: profile.resume || "",
  matchedSkills: evaluation.matchedSkills,
  missingSkills: evaluation.missingSkills,
  skillMatchPercentage: evaluation.skillMatchPercentage,
  eligibilityReasons: evaluation.reasons,
  isEligible: evaluation.isEligible,
});

const sortShortlistedStudents = (students) =>
  students.sort((left, right) => {
    if (right.skillMatchPercentage !== left.skillMatchPercentage) {
      return right.skillMatchPercentage - left.skillMatchPercentage;
    }

    return (right.cgpa || 0) - (left.cgpa || 0);
  });

const buildEligibleStudentsForJob = (job, profiles) =>
  sortShortlistedStudents(
    profiles
      .filter((profile) => profile.student)
      .map((profile) => {
        const student = profile.student;
        const evaluation = evaluateStudentEligibility({ job, student, profile });
        return toShortlistedStudent(student, profile, evaluation);
      })
      .filter((student) => student.isEligible)
  );

export const getEligibleJobsForStudent = async (studentId) => {
  const student = await Student.findById(studentId).select(
    "fullName email rollNo branch"
  );

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  const profile = await Profile.findOne({ student: studentId }).lean();
  const jobs = await JobPost.find({ status: { $ne: "Closed" } })
    .sort({ createdAt: -1 })
    .populate("companyId", "name")
    .lean();

  const eligibleJobs = jobs
    .map((job) => {
      const evaluation = evaluateStudentEligibility({ job, student, profile });

      return {
        _id: job._id,
        title: job.job_title,
        jobType: job.job_type,
        location: job.job_location,
        salary: job.salary,
        deadline: job.deadline,
        companyName: job.companyId?.name || "Unknown Company",
        criteria: job.criteria,
        skills: sanitizeStringList(job.skills, toTitleCase),
        matchedSkills: evaluation.matchedSkills,
        missingSkills: evaluation.missingSkills,
        skillMatchPercentage: evaluation.skillMatchPercentage,
        isEligible: evaluation.isEligible,
        postedAt: job.createdAt,
      };
    })
    .filter((job) => job.isEligible)
    .sort((left, right) => {
      if (right.skillMatchPercentage !== left.skillMatchPercentage) {
        return right.skillMatchPercentage - left.skillMatchPercentage;
      }

      return new Date(left.deadline) - new Date(right.deadline);
    });

  return {
    student: {
      fullName: student.fullName,
      email: student.email,
      branch: profile?.department || student.branch,
      cgpa: profile?.cgpa ?? null,
    },
    shortlistRules: {
      minSkillMatchPercentage: MIN_SHORTLIST_SKILL_MATCH_PERCENTAGE,
    },
    eligibleJobs,
  };
};

export const getEligibilityOverviewForAdmin = async () => {
  const [jobs, profiles] = await Promise.all([
    JobPost.find({ status: { $ne: "Closed" } })
      .sort({ createdAt: -1 })
      .populate("companyId", "name")
      .lean(),
    Profile.find({})
      .populate("student", "fullName email rollNo branch")
      .lean(),
  ]);

  const jobShortlists = jobs
    .map((job) => {
      const eligibleStudents = buildEligibleStudentsForJob(job, profiles);

      return {
        jobId: job._id,
        title: job.job_title,
        companyName: job.companyId?.name || "Unknown Company",
        location: job.job_location,
        deadline: job.deadline,
        totalEligibleStudents: eligibleStudents.length,
        eligibility: sanitizeEligibility(job.eligibility),
        criteria: job.criteria,
        skills: sanitizeStringList(job.skills, toTitleCase),
        eligibleStudents,
      };
    })
    .sort((left, right) => right.totalEligibleStudents - left.totalEligibleStudents);

  return {
    shortlistRules: {
      minSkillMatchPercentage: MIN_SHORTLIST_SKILL_MATCH_PERCENTAGE,
    },
    summary: {
      totalJobs: jobShortlists.length,
      totalEligibleMappings: jobShortlists.reduce(
        (sum, job) => sum + job.totalEligibleStudents,
        0
      ),
      jobsWithEligibleStudents: jobShortlists.filter(
        (job) => job.totalEligibleStudents > 0
      ).length,
    },
    jobs: jobShortlists,
  };
};

