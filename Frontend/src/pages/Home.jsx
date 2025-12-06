import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const Home = () => {
    const [stats, setStats] = useState({
        jobs: 0,
        companies: 0
    });
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, statsRes, companiesRes] = await Promise.all([
                    api.get('/jobs/public?limit=6').catch(() => ({ data: [] })),
                    api.get('/stats/company-count').catch(() => ({ data: { count: 0 } })),
                    api.get('/company/all').catch(() => ({ data: [] }))
                ]);

                // Map backend snake_case to frontend camelCase
                const formattedJobs = jobsRes.data.map(job => ({
                    ...job,
                    title: job.job_title,
                    jobType: job.job_type,
                    location: job.job_location,
                    companyName: job.companyId?.name || "Company"
                }));

                setJobs(formattedJobs);
                setCompanies(companiesRes.data);
                setStats({
                    jobs: formattedJobs.length,
                    companies: companiesRes.data.length
                });
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
                style={{ backgroundImage: "url('/assets/hero-bg.png')" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/60"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up">Your Gateway to Career Success</h1>
                        <p className="text-lg md:text-xl text-white/90 mb-10 animate-fade-up delay-100">Connect with top employers, discover opportunities, and take the next step in your professional journey.</p>
                        <div className="flex flex-wrap gap-4 justify-center animate-fade-up delay-200">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        <StatCard icon="ri-briefcase-line" color="text-primary" bg="bg-blue-100" count={stats.jobs} label="Active Job Postings" />
                        <StatCard icon="ri-building-line" color="text-purple-600" bg="bg-purple-100" count={stats.companies} label="Registered Companies" />
                    </div>
                </div>
            </section>

            {/* About Platform Section */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <img src="/assets/about-platform.png" alt="Platform Overview" className="rounded-lg shadow-lg w-full" />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Connecting Talent with Opportunity</h2>
                            <p className="text-lg text-gray-600 mb-4">
                                Our platform bridges the gap between talented students and leading companies, streamlining the recruitment process for everyone involved.
                            </p>
                            <p className="text-lg text-gray-600 mb-6">
                                Whether you're a student seeking your dream job or a company looking for exceptional talent, we provide the tools and connections you need to succeed.
                            </p>
                            <div className="flex gap-4">
                                <Link to="/student/register">
                                    <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                                        Join as Student
                                    </button>
                                </Link>
                                <Link to="/company/register">
                                    <button className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                                        Post Jobs
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">Why Choose Us</h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Experience a seamless recruitment journey with our comprehensive platform features
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="/assets/feature-recruitment.png"
                            title="Smart Job Matching"
                            description="Advanced algorithms connect students with jobs that match their skills, interests, and career goals."
                        />
                        <FeatureCard
                            icon="/assets/feature-tracking.png"
                            title="Application Tracking"
                            description="Monitor your application status in real-time and stay updated on every step of the hiring process."
                        />
                        <FeatureCard
                            icon="/assets/feature-connect.png"
                            title="Direct Company Connect"
                            description="Build meaningful connections with recruiters and hiring managers from top companies."
                        />
                    </div>
                </div>
            </section>

            {/* Jobs Section */}
            <section id="jobs" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-10">Latest Job Openings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

                    {jobs.length > 0 && (
                        <div className="text-center">
                            <Link to="/jobs">
                                <button className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
                                    View All Jobs
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Companies Section */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Top Recruiters</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {companies.length > 0 ? (
                            companies.slice(0, 8).map(company => (
                                <CompanyCard key={company._id} company={company} />
                            ))
                        ) : (
                            <p className="text-gray-500">No companies registered yet.</p>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const StatCard = ({ icon, color, bg, count, label }) => (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
        <div className={`w-14 h-14 flex items-center justify-center ${bg} rounded-full mb-4 mx-auto`}>
            <i className={`${icon} ri-lg ${color}`}></i>
        </div>
        <h3 className="text-4xl font-bold text-gray-800 mb-2">{count}</h3>
        <p className="text-gray-600">{label}</p>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center">
        <div className="w-24 h-24 mx-auto mb-6">
            <img src={icon} alt={title} className="w-full h-full object-contain" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
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

const CompanyCard = ({ company }) => {
    const logoLetter = company.name.charAt(0).toUpperCase();
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
    const colorIndex = company.name.charCodeAt(0) % colors.length;

    return (
        <div className="bg-white px-6 py-8 rounded-xl shadow-sm border border-gray-100 text-center w-full md:w-auto min-w-[180px] hover:shadow-lg transition-all group">
            <div className={`w-20 h-20 ${colors[colorIndex]} text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-md group-hover:scale-110 transition-transform`}>
                {logoLetter}
            </div>
            <h3 className="font-bold text-gray-800 mb-1 text-sm">{company.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{company.domain}</p>
            <div className="text-xs text-gray-400 flex items-center justify-center">
                <i className="ri-map-pin-line mr-1"></i> {company.address}
            </div>
        </div>
    );
};

export default Home;
