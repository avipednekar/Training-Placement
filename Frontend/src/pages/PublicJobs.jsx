import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import jobService from '../services/jobService';
import JobCard from '../components/JobCard';

const PublicJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const formattedJobs = await jobService.getPublicJobs();
                setJobs(formattedJobs);
                setFilteredJobs(formattedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Helper to extract unique locations for dropdown
    const uniqueLocations = [...new Set(jobs.map(job => job.location))].filter(Boolean).sort();

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();

        const filtered = jobs.filter(job => {
            const matchesSearch =
                (job.title && job.title.toLowerCase().includes(lowerSearch)) ||
                (job.companyName && job.companyName.toLowerCase().includes(lowerSearch));

            const matchesType = jobType ? job.type === jobType : true;
            const matchesLocation = location ? job.location === location : true;

            return matchesSearch && matchesType && matchesLocation;
        });

        setFilteredJobs(filtered);
    }, [searchTerm, jobType, location, jobs]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="pt-24 pb-12 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Find Your Dream Job</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Explore hundreds of job opportunities from top companies and take the next step in your career.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-grow w-full md:w-auto relative">
                            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Search by Job Title or Company"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="w-full md:w-48">
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer"
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                            >
                                <option value="">All Job Types</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        <div className="w-full md:w-48">
                            <select
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                <option value="">All Locations</option>
                                {uniqueLocations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-500">
                        Showing <span className="font-bold text-gray-800">{filteredJobs.length}</span> jobs
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        // Skeleton Loader Placeholder
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                                    <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                                </div>
                                <div className="pt-4 border-t border-gray-50">
                                    <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        ))
                    ) : filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <JobCard key={job._id} job={job} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <div className="mb-6 relative w-48 h-48 mx-auto">
                                <div className="absolute inset-0 bg-blue-50 rounded-full opacity-50 blur-xl"></div>
                                <i className="ri-search-eye-line text-8xl text-primary/40 relative z-10"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Jobs Found</h3>
                            <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
                                We couldn't find any jobs matching your current filters. Try adjusting your search criteria.
                            </p>
                            <button
                                onClick={() => { setSearchTerm(''); setJobType(''); setLocation(''); }}
                                className="bg-white text-primary border border-primary px-6 py-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PublicJobs;
