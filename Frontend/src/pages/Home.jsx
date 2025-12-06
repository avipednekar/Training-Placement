import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import JobCard from '../components/JobCard';
import jobService from '../services/jobService';
import useCountUp from '../hooks/useCountUp';

const Home = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        jobs: 0,
        companies: 0
    });
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroSearch, setHeroSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsData, statsRes, companiesRes] = await Promise.all([
                    jobService.getPublicJobs({ limit: 6 }).catch(() => []),
                    api.get('/stats/company-count').catch(() => ({ data: { count: 0 } })),
                    api.get('/company/all').catch(() => ({ data: [] }))
                ]);

                setJobs(jobsData);
                setCompanies(companiesRes.data);
                setStats({
                    jobs: statsRes.data.count || 0,
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

    const handleHeroSearch = (e) => {
        e.preventDefault();
        if (heroSearch.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(heroSearch)}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-24 relative overflow-hidden bg-center bg-cover"
                style={{ backgroundImage: "url('/assets/hero-bg.png')" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up">
                            Your Gateway to <span className="text-primary-light">Career Success</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-10 animate-fade-up delay-100 max-w-2xl mx-auto">
                            Connect with top employers, discover opportunities, and take the next step in your professional journey.
                        </p>

                        {/* Hero Search */}
                        <div className="max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
                            <form onSubmit={handleHeroSearch} className="relative group">
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors"></div>
                                <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl border border-white/10">
                                    <i className="ri-search-line text-gray-400 ml-4 text-xl"></i>
                                    <input
                                        type="text"
                                        placeholder="Search for 'Software Engineer' or 'Data Analyst'..."
                                        className="flex-grow px-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
                                        value={heroSearch}
                                        onChange={(e) => setHeroSearch(e.target.value)}
                                    />
                                    <button type="button" onClick={() => navigate('/jobs')} className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg">
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center animate-fade-up delay-300">
                            <Link to="/student/login">
                                <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all">
                                    Student Login
                                </button>
                            </Link>
                            <Link to="/company/login">
                                <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all">
                                    Company Login
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section with Animation */}
            <section className="py-16 bg-white relative z-20 -mt-10 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto shadow-xl rounded-2xl bg-white p-8 border border-gray-100">
                    <StatCard icon="ri-briefcase-line" color="text-primary" bg="bg-blue-50" count={stats.jobs} label="Active Job Postings" />
                    <StatCard icon="ri-building-line" color="text-purple-600" bg="bg-purple-50" count={stats.companies} label="Registered Companies" />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">Process</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">How It Works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

                        <StepCard number="1" title="Register Profile" icon="ri-user-add-line" desc="Create your student profile and highlight your skills." />
                        <StepCard number="2" title="Upload Resume" icon="ri-file-upload-line" desc="Upload your latest resume to showcase your experience." />
                        <StepCard number="3" title="Apply Jobs" icon="ri-briefcase-line" desc="Browse and apply to jobs that match your profile." />
                        <StepCard number="4" title="Get Hired" icon="ri-shake-hands-line" desc="Clear interviews and kickstart your dream career." />
                    </div>
                </div>
            </section>

            {/* About Platform Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2 relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>
                            <img src="/assets/about-platform.png" alt="Platform Overview" className="relative rounded-2xl shadow-2xl w-full rotate-2 hover:rotate-0 transition-transform duration-500" />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Connecting Talent with Opportunity</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Our platform bridges the gap between talented students and leading companies, streamlining the recruitment process for everyone involved.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center text-gray-700">
                                    <i className="ri-checkbox-circle-fill text-green-500 mr-3 text-xl"></i>
                                    Verified Companies and Students
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <i className="ri-checkbox-circle-fill text-green-500 mr-3 text-xl"></i>
                                    Real-time Application Tracking
                                </li>
                                <li className="flex items-center text-gray-700">
                                    <i className="ri-checkbox-circle-fill text-green-500 mr-3 text-xl"></i>
                                    Seamless Communication
                                </li>
                            </ul>
                            <div className="flex gap-4">
                                <Link to="/student/register">
                                    <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark shadow-lg shadow-blue-500/30 transition-all">
                                        Join as Student
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
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

            {/* Testimonials Section */}
            <section className="py-20 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Success Stories</h2>
                        <p className="text-gray-600 mt-4">Hear from students who found their dream jobs</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <TestimonialCard
                            name="Rahul Sharma"
                            role="SDE at TCS"
                            quote="This platform made the application process so smooth. I got placed within 2 weeks!"
                            initial="R" color="bg-orange-500"
                        />
                        <TestimonialCard
                            name="Priya Patel"
                            role="Analyst at Infosys"
                            quote="The direct connection with recruiters was a game changer for me. Highly recommended."
                            initial="P" color="bg-purple-500"
                        />
                        <TestimonialCard
                            name="Amit Kumar"
                            role="DevOps at Wipro"
                            quote="Amazing experience. The layout and features are top-notch and very user friendly."
                            initial="A" color="bg-blue-500"
                        />
                    </div>
                </div>
            </section>

            {/* Jobs Section */}
            <section id="jobs" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest Job Openings</h2>
                            <p className="text-gray-600">Fresh opportunities added every day</p>
                        </div>
                        <Link to="/jobs" className="hidden md:block">
                            <span className="text-primary font-semibold flex items-center hover:underline">
                                View All Jobs <i className="ri-arrow-right-line ml-2"></i>
                            </span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {loading ? (
                            <div className="col-span-full text-center">Loading...</div>
                        ) : jobs.length > 0 ? (
                            jobs.map(job => (
                                <JobCard key={job._id} job={job} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <i className="ri-briefcase-line text-6xl text-gray-300 mb-4 block"></i>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Job Postings</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any open positions at the moment. Check back later or subscribe to alerts.</p>
                                <button className="text-primary font-semibold hover:underline">
                                    Subscribe to Job Alerts <i className="ri-notification-3-line ml-1"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="text-center md:hidden">
                        <Link to="/jobs">
                            <button className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
                                View All Jobs
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Companies Section */}
            <section className="py-20 bg-white border-t border-gray-100">
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

const StatCard = ({ icon, color, bg, count, label }) => {
    const animatedCount = useCountUp(count);
    return (
        <div className="text-center p-4">
            <div className={`w-16 h-16 flex items-center justify-center ${bg} rounded-2xl mb-4 mx-auto transform rotate-3 hover:rotate-0 transition-all`}>
                <i className={`${icon} ri-2x ${color}`}></i>
            </div>
            <h3 className="text-4xl font-bold text-gray-800 mb-2">{animatedCount}+</h3>
            <p className="text-gray-600 font-medium">{label}</p>
        </div>
    );
};

const StepCard = ({ number, title, icon, desc }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative z-10 hover:-translate-y-2 transition-transform duration-300">
        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-blue-500/30">
            {number}
        </div>
        <div className="mb-4 text-gray-300">
            <i className={`${icon} text-5xl`}></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
    </div>
);

const TestimonialCard = ({ name, role, quote, initial, color }) => (
    <div className="bg-gray-50 p-8 rounded-2xl max-w-sm flex-1 min-w-[300px] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
        <div className="flex items-center mb-6">
            <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white font-bold text-xl mr-4`}>
                {initial}
            </div>
            <div>
                <h4 className="font-bold text-gray-800">{name}</h4>
                <p className="text-xs text-primary font-semibold">{role}</p>
            </div>
        </div>
        <p className="text-gray-600 italic leading-relaxed">"{quote}"</p>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center group">
        <div className="w-24 h-24 mx-auto mb-6 group-hover:scale-110 transition-transform">
            <img src={icon} alt={title} className="w-full h-full object-contain" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
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
