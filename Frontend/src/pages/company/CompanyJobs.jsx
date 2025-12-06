import { useState, useEffect } from 'react';
import api from '../../services/api';

const CompanyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            // Assuming endpoint exists for company to get their own jobs
            const response = await api.get('/jobs/my-jobs');
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            // Fallback for demo if API isn't ready
            setJobs([
                { _id: '1', title: 'Senior Software Engineer', postedDate: '2025-04-28', status: 'Active', applications: 42 },
                { _id: '2', title: 'Product Manager', postedDate: '2025-04-27', status: 'Active', applications: 36 },
                { _id: '3', title: 'UX Designer', postedDate: '2025-04-26', status: 'Closing Soon', applications: 28 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Manage Jobs</h2>
                <button className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                    <i className="ri-add-line mr-1"></i> Post New Job
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Job Title</th>
                            <th className="p-4 font-semibold text-gray-600">Posted Date</th>
                            <th className="p-4 font-semibold text-gray-600">Applications</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job._id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{job.title}</td>
                                <td className="p-4 text-gray-600">{job.postedDate}</td>
                                <td className="p-4 text-gray-600">{job.applications}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${job.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            job.status === 'Closed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                                    <button className="text-red-600 hover:text-red-800">Close</button>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">No jobs posted yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyJobs;
