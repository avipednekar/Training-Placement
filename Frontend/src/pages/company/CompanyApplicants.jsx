import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const CompanyApplicants = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const preselectedJobId = searchParams.get('jobId') || '';

    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(preselectedJobId);
    const [shortlist, setShortlist] = useState(null);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [shortlistLoading, setShortlistLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/jobs/my-jobs');
                setJobs(response.data || []);

                if (!preselectedJobId && response.data?.length) {
                    const defaultJobId = response.data[0]._id;
                    setSelectedJobId(defaultJobId);
                    setSearchParams({ jobId: defaultJobId });
                }
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Unable to load company jobs right now.');
            } finally {
                setJobsLoading(false);
            }
        };

        fetchJobs();
    }, [preselectedJobId, setSearchParams]);

    useEffect(() => {
        if (!selectedJobId) {
            setShortlist(null);
            return;
        }

        const fetchShortlist = async () => {
            setShortlistLoading(true);
            setError('');

            try {
                const response = await api.get(`/jobs/${selectedJobId}/eligible-students`);
                setShortlist(response.data);
            } catch (err) {
                console.error('Error fetching eligible students:', err);
                setError('Unable to generate the eligible students list for this job.');
            } finally {
                setShortlistLoading(false);
            }
        };

        fetchShortlist();
    }, [selectedJobId]);

    const selectedJob = useMemo(
        () => jobs.find((job) => job._id === selectedJobId),
        [jobs, selectedJobId]
    );

    const handleJobChange = (event) => {
        const nextJobId = event.target.value;
        setSelectedJobId(nextJobId);
        if (nextJobId) {
            setSearchParams({ jobId: nextJobId });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Eligible Students</h1>
                    <p className="text-gray-500 mt-1">
                        Generate an automatic shortlist using branch, CGPA, backlog, graduation year, and skill fit.
                    </p>
                </div>

                <div className="w-full md:w-96">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Job</label>
                    <select
                        value={selectedJobId}
                        onChange={handleJobChange}
                        className="w-full p-3 border rounded-lg bg-white"
                        disabled={jobsLoading}
                    >
                        <option value="">Choose a job</option>
                        {jobs.map((job) => (
                            <option key={job._id} value={job._id}>
                                {job.job_title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {selectedJob && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SummaryCard label="Job Title" value={selectedJob.job_title} />
                    <SummaryCard label="Min CGPA" value={shortlist?.job?.eligibility?.minCgpa ?? 'NA'} />
                    <SummaryCard label="Max Backlogs" value={shortlist?.job?.eligibility?.maxBacklogs ?? 'NA'} />
                    <SummaryCard label="Eligible Students" value={shortlist?.eligibleStudents?.length ?? 0} />
                </div>
            )}

            {shortlist?.job && (
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Shortlist Rules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <p><span className="font-medium text-gray-800">Branches:</span> {shortlist.job.eligibility.branches.join(', ') || 'Any'}</p>
                        <p><span className="font-medium text-gray-800">Graduation Years:</span> {shortlist.job.eligibility.graduationYears.join(', ') || 'Any'}</p>
                        <p><span className="font-medium text-gray-800">Preferred Skills:</span> {shortlist.job.skills.join(', ') || 'None specified'}</p>
                        <p><span className="font-medium text-gray-800">Criteria Notes:</span> {shortlist.job.criteria || 'Generated from structured eligibility'}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Automatic Shortlist</h2>
                </div>

                {jobsLoading || shortlistLoading ? (
                    <div className="p-8 text-center text-gray-500">Generating shortlist...</div>
                ) : !selectedJobId ? (
                    <div className="p-8 text-center text-gray-500">Select a job to see eligible students.</div>
                ) : shortlist?.eligibleStudents?.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                                <tr>
                                    <th className="p-4 font-semibold">Student</th>
                                    <th className="p-4 font-semibold">Branch</th>
                                    <th className="p-4 font-semibold">CGPA</th>
                                    <th className="p-4 font-semibold">Backlogs</th>
                                    <th className="p-4 font-semibold">Graduation</th>
                                    <th className="p-4 font-semibold">Skill Match</th>
                                    <th className="p-4 font-semibold">Matched Skills</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shortlist.eligibleStudents.map((student) => (
                                    <tr key={student.studentId} className="border-b border-gray-50 align-top">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800">{student.fullName}</div>
                                            <div className="text-sm text-gray-500">{student.email}</div>
                                            <div className="text-xs text-gray-400 mt-1">Roll No: {student.rollNo}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">{student.branch || 'NA'}</td>
                                        <td className="p-4 text-gray-600">{student.cgpa ?? 'NA'}</td>
                                        <td className="p-4 text-gray-600">{student.backlogs ?? 'NA'}</td>
                                        <td className="p-4 text-gray-600">{student.graduationYear || 'NA'}</td>
                                        <td className="p-4">
                                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                                {student.skillMatchPercentage}%
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {student.matchedSkills.length ? student.matchedSkills.map((skill) => (
                                                    <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                        {skill}
                                                    </span>
                                                )) : (
                                                    <span className="text-sm text-gray-400">No listed skill matches</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No students match the academic eligibility for this job yet.
                    </div>
                )}
            </div>
        </div>
    );
};

const SummaryCard = ({ label, value }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="mt-2 text-xl font-semibold text-gray-800">{value}</h3>
    </div>
);

export default CompanyApplicants;
