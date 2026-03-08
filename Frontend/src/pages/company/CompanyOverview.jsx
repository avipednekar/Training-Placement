import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CompanyOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeJobs: 0,
        applications: 0,
        interviews: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user?._id) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/stats/${user._id}`);
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching company stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Company Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardStatCard
                    label="Active Job Postings"
                    value={stats.activeJobs}
                    icon="ri-briefcase-line"
                    iconBg="bg-blue-50"
                    iconColor="text-primary"
                    loading={loading}
                />
                <DashboardStatCard
                    label="Total Applications"
                    value={stats.applications}
                    icon="ri-group-line"
                    iconBg="bg-green-50"
                    iconColor="text-green-600"
                    loading={loading}
                />
                <DashboardStatCard
                    label="Interviews Scheduled"
                    value={stats.interviews}
                    icon="ri-calendar-event-line"
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                    loading={loading}
                />
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

const DashboardStatCard = ({ label, value, icon, iconBg, iconColor, loading }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                    {loading ? '—' : value}
                </h3>
            </div>
            <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center ${iconColor}`}>
                <i className={`${icon} text-xl`}></i>
            </div>
        </div>
    </div>
);

export default CompanyOverview;
