import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentOverview = () => {
    const [stats, setStats] = useState({ applications: 0, interviews: 0, offers: 0, eligibleJobs: 0 });
    const [topJobs, setTopJobs] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch eligible jobs
                const jobsResponse = await api.get('/jobs/eligible-for-me');
                const eligibleJobs = jobsResponse.data?.eligibleJobs || [];
                setStats((prev) => ({
                    ...prev,
                    eligibleJobs: eligibleJobs.length,
                }));
                setTopJobs(eligibleJobs.slice(0, 3));

                // Fetch application stats
                const statsResponse = await api.get('/students/my-applications');
                const applications = statsResponse.data?.applications || [];
                
                // Count interviews (applications with status 'interview' or similar)
                const interviews = applications.filter(app => 
                    app.status?.toLowerCase() === 'interview' || 
                    app.status?.toLowerCase() === 'shortlisted'
                ).length;
                
                // Count offers (applications with status 'offer' or 'selected')
                const offers = applications.filter(app => 
                    app.status?.toLowerCase() === 'offer' || 
                    app.status?.toLowerCase() === 'selected' ||
                    app.status?.toLowerCase() === 'placed'
                ).length;

                setStats((prev) => ({
                    ...prev,
                    applications: applications.length,
                    interviews,
                    offers,
                }));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <Link to="/" className="text-primary hover:text-blue-700 font-medium flex items-center">
                    <i className="ri-home-line mr-2"></i> Back to Home
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Eligible Jobs</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.eligibleJobs}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary">
                            <i className="ri-briefcase-line text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Upcoming Interviews</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.interviews}</h3>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                            <i className="ri-calendar-event-line text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Job Offers</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.offers}</h3>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <i className="ri-trophy-line text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Eligible Jobs</h2>
                {topJobs.length ? (
                    <div className="space-y-4">
                        {topJobs.map((job) => (
                            <div key={job._id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
                                <div>
                                    <h3 className="font-medium text-gray-800">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.companyName} · {job.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-emerald-700">{job.skillMatchPercentage}% match</p>
                                    <Link to="/student/jobs" className="text-sm text-primary hover:text-blue-700">View jobs</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        No eligible jobs available for your current profile.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentOverview;
