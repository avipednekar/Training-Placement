import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs/public');
            setJobs(response.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        (job.title && job.title.toLowerCase().includes(search.toLowerCase())) ||
        (job.companyName && job.companyName.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Available Jobs</h1>
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="p-2 border rounded w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map(job => (
                        <div key={job._id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                            <span className="absolute top-4 right-4 bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">{job.jobType}</span>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{job.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{job.companyName || "Unknown Company"}</p>

                            <div className="space-y-2 text-sm text-gray-500 mb-6">
                                <div className="flex items-center"><i className="ri-map-pin-line mr-2"></i> {job.location}</div>
                                <div className="flex items-center"><i className="ri-money-dollar-circle-line mr-2"></i> {job.salary}</div>
                                <div className="flex items-center"><i className="ri-calendar-line mr-2"></i> Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
                            </div>

                            <Link to={`/student/apply/${job._id}`} className="block w-full bg-white text-primary border border-primary text-center py-2 rounded hover:bg-primary hover:text-white transition-colors">
                                Apply Now
                            </Link>
                        </div>
                    ))}
                    {filteredJobs.length === 0 && <p className="col-span-full text-center text-gray-500">No jobs found matching your search.</p>}
                </div>
            )}
        </div>
    );
};

export default StudentJobs;
