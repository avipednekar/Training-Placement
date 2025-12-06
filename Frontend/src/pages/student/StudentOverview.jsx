import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ applications: 0, interviews: 0, offers: 0 });

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
                            <p className="text-gray-500 text-sm">Total Applications</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.applications}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary">
                            <i className="ri-file-list-3-line text-xl"></i>
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
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="text-center text-gray-500 py-8">
                    No recent activity found. Start applying to jobs!
                </div>
            </div>
        </div>
    );
};

export default StudentOverview;
