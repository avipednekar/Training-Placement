import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const Home = () => {
    const [stats, setStats] = useState({
        jobs: 0,
        placed: 1423,
        interviews: 78,
        companies: 0
    });
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, statsRes] = await Promise.all([
                    api.get('/jobs/public').catch(() => ({ data: [] })),
                    api.get('/stats/company-count').catch(() => ({ data: { count: 0 } }))
                ]);

                setJobs(jobsRes.data);
                setStats(prev => ({
                    ...prev,
                    jobs: jobsRes.data.length,
                    companies: statsRes.data.count
                }));
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-24 relative overflow-hidden bg-center bg-cover"
                style={{ backgroundImage: "url('https://placehold.co/1920x800/E0F2FE/0C4A6E?text=Your+Gateway+to+Career+Success')" }}>
                <div className="absolute inset-0 bg-primary/30"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Your Gateway to Career Success</h1>
                        <p className="text-lg md:text-xl text-white/90 mb-8">Connect with top employers, discover opportunities, and take the next step in your professional journey.</p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/student/login">
                                <button className="bg-white text-primary px-6 py-3 rounded-button font-semibold hover:bg-gray-100 transition-colors">
                                    Student Login
                                </button>
                            </Link>
                            <Link to="/company/login">
                                <button className="bg-primary text-white border border-white px-6 py-3 rounded-button font-semibold hover:bg-primary/90 transition-colors">
                                    Company Login
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StatCard icon="ri-briefcase-line" color="text-primary" bg="bg-blue-100" count={stats.jobs} label="Total Job Postings" />
                        <StatCard icon="ri-user-star-line" color="text-green-600" bg="bg-green-100" count={stats.placed} label="Students Placed" />
                        <StatCard icon="ri-calendar-check-line" color="text-amber-600" bg="bg-amber-100" count={stats.interviews} label="Upcoming Interviews" />
                        <StatCard icon="ri-building-line" color="text-purple-600" bg="bg-purple-100" count={stats.companies} label="Registered Companies" />
                    </div>
                </div>
            </section>

            {/* Jobs Section */}
            <section id="jobs" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-10">Latest Job Openings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading ? (
                            <p>Loading...</p>
                        ) : jobs.length > 0 ? (
                            jobs.map(job => (
                                <JobCard key={job._id} job={job} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No active job listings found.</p>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const StatCard = ({ icon, color, bg, count, label }) => (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className={`w-14 h-14 flex items-center justify-center ${bg} rounded-full mb-4`}>
            <i className={`${icon} ri-lg ${color}`}></i>
        </div>
        <h3 className="text-4xl font-bold text-gray-800 mb-2">{count}</h3>
        <p className="text-gray-600">{label}</p>
    </div>
);

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

export default Home;
