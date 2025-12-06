import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CompanyOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0 });

    useEffect(() => {
        // Fetch stats if API endpoint exists
        // api.get('/company/stats').then(res => setStats(res.data));
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Company Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Active Job Postings</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.activeJobs}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary">
                            <i className="ri-briefcase-line text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Applicants</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalApplicants}</h3>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                            <i className="ri-group-line text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Applicants</h2>
                <div className="text-center text-gray-500 py-8">
                    No recent applications. Post a job to get started!
                </div>
            </div>
        </div>
    );
};

export default CompanyOverview;
