import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/student/login');
    };

    const menuItems = [
        { path: '/student/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
        { path: '/student/profile', icon: 'ri-user-settings-line', label: 'My Profile' },
        { path: '/student/jobs', icon: 'ri-briefcase-line', label: 'Jobs' },
        { path: '/student/applications', icon: 'ri-file-list-3-line', label: 'Applications' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-center">
                    <img src="/assets/logo-wide.png" alt="Logo" className="h-10" />
                </div>

                <div className="p-6 border-b border-gray-100 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center text-primary text-2xl font-bold">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <h3 className="font-semibold text-gray-800">{user?.name || 'Student'}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${location.pathname === item.path
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <i className={`${item.icon} text-lg mr-3`}></i>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                        <i className="ri-logout-box-line text-lg mr-3"></i>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 p-4 md:hidden flex items-center justify-between">
                    <img src="/assets/logo-wide.png" alt="Logo" className="h-8" />
                    <button className="text-gray-600">
                        <i className="ri-menu-line text-2xl"></i>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
