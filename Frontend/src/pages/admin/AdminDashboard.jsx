import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await api.get('/admin/eligibility-overview');
                const data = response.data;
                setOverview(data);
                if (data.jobs?.length) {
                    setSelectedJobId(data.jobs[0].jobId);
                }
            } catch (err) {
                console.error('Error fetching admin overview:', err);
                setError('Unable to load central eligibility management data.');
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    const selectedJob = useMemo(
        () => overview?.jobs?.find((job) => job.jobId === selectedJobId) || overview?.jobs?.[0],
        [overview, selectedJobId]
    );

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading admin dashboard...</div>;
    }

    if (error) {
        return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Central Eligibility Management</h1>
                <p className="text-gray-500 mt-1">
                    Review all jobs and the system-generated eligible student lists from one place.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SummaryCard label="Active Jobs" value={overview?.summary?.totalJobs || 0} />
                <SummaryCard label="Eligible Mappings" value={overview?.summary?.totalEligibleMappings || 0} />
                <SummaryCard label="Jobs With Shortlists" value={overview?.summary?.jobsWithEligibleStudents || 0} />
                <SummaryCard label="Skill Threshold" value={`>${(overview?.shortlistRules?.minSkillMatchPercentage || 51) - 1}%`} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">Jobs</h2>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[640px] overflow-y-auto">
                        {overview?.jobs?.map((job) => (
                            <button
                                key={job.jobId}
                                onClick={() => setSelectedJobId(job.jobId)}
                                className={`w-full text-left px-6 py-4 transition-colors ${selectedJob?.jobId === job.jobId ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{job.title}</h3>
                                        <p className="text-sm text-gray-500">{job.companyName}</p>
                                        <p className="text-xs text-gray-400 mt-1">{job.location}</p>
                                    </div>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        {job.totalEligibleStudents}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="xl:col-span-2 space-y-6">
                    {selectedJob && (
                        <>
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-800">{selectedJob.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{selectedJob.companyName} · {selectedJob.location}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
                                    <p><span className="font-medium text-gray-800">Branches:</span> {selectedJob.eligibility.branches.join(', ') || 'Any'}</p>
                                    <p><span className="font-medium text-gray-800">Graduation Years:</span> {selectedJob.eligibility.graduationYears.join(', ') || 'Any'}</p>
                                    <p><span className="font-medium text-gray-800">Minimum CGPA:</span> {selectedJob.eligibility.minCgpa}</p>
                                    <p><span className="font-medium text-gray-800">Maximum Backlogs:</span> {selectedJob.eligibility.maxBacklogs}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-800">Eligible Students</h2>
                                    <span className="text-sm text-gray-500">{selectedJob.totalEligibleStudents} shortlisted</span>
                                </div>

                                {(selectedJob?.eligibleStudents?.length) ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                                                <tr>
                                                    <th className="p-4 font-semibold">Student</th>
                                                    <th className="p-4 font-semibold">Branch</th>
                                                    <th className="p-4 font-semibold">CGPA</th>
                                                    <th className="p-4 font-semibold">Match</th>
                                                    <th className="p-4 font-semibold">Matched Skills</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedJob.eligibleStudents.map((student) => (
                                                    <tr key={student.studentId} className="border-b border-gray-50 align-top">
                                                        <td className="p-4">
                                                            <div className="font-medium text-gray-800">{student.fullName}</div>
                                                            <div className="text-sm text-gray-500">{student.email}</div>
                                                            <div className="text-xs text-gray-400 mt-1">Roll No: {student.rollNo}</div>
                                                        </td>
                                                        <td className="p-4 text-gray-600">{student.branch}</td>
                                                        <td className="p-4 text-gray-600">{student.cgpa}</td>
                                                        <td className="p-4 text-emerald-700 font-medium">{student.skillMatchPercentage}%</td>
                                                        <td className="p-4">
                                                            <div className="flex flex-wrap gap-2">
                                                                {student.matchedSkills.map((skill) => (
                                                                    <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">No students are currently shortlisted for this job.</div>
                                )}
                            </div>
                        </>
                    )}
                </div>
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

export default AdminDashboard;
