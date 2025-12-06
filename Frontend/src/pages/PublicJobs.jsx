import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const PublicJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch all jobs without limit
                const response = await api.get('/jobs/public');

                // Map backend snake_case to frontend camelCase
                const formattedJobs = response.data.map(job => ({
                    ...job,
                    title: job.job_title,
                    jobType: job.job_type,
                    location: job.job_location,
                    companyName: job.companyId?.name || "Company"
                }));

                setJobs(formattedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const JobCard = ({ job }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all p-6 relative">
            <span className="absolute top-6 right-6 bg-blue-50 text-primary text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-100">
                {job.jobType}
            </span>
            <h3 className="text-xl font-bold text-gray-800 mb-2 pr-20">{job.title}</h3>
            <p className="text-gray-600 font-medium mb-4">{job.companyName || "Company"}</p>
            <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-500 text-sm">
                    <i className="ri-map-pin-line mr-2"></i>Location: {job.location}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <i className="ri-money-dollar-circle-line mr-2"></i>Package: {job.salary}
                </div>
            </div>
            <Link to="/student/login">
                <button className="w-full bg-white text-primary border border-primary py-2 rounded-button hover:bg-primary hover:text-white transition-colors">
                    Apply Now
                </button>
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Find Your Dream Job</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore hundreds of job opportunities from top companies and take the next step in your career.
                    </p>
                </div>
            </div>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading jobs...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        jobs.map(job => (
                            <JobCard key={job._id} job={job} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <i className="ri-briefcase-line text-6xl text-gray-300 mb-4"></i>
                            <p className="text-gray-500 text-lg">No active job listings found.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PublicJobs;
