import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path ? "bg-gray-700 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800";
    };

    return (
        <header className="w-full bg-gray-900/95 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-800">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    {/* Using absolute path to public folder assets */}
                    <img src="/assets/logo-wide.png" className="h-12 md:h-16 bg-white p-1 rounded" alt="Logo" />
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link to="/" className={`font-medium px-3 py-2 rounded-md transition-all ${isActive('/')}`}>
                        Home
                    </Link>
                    <Link to="/jobs" className={`font-medium px-3 py-2 rounded-md transition-all ${isActive('/jobs')}`}>
                        Jobs
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to={user.role === 'student' ? '/student/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/company/dashboard'}
                                className={`font-medium px-3 py-2 rounded-md transition-all ${isActive(user.role === 'student' ? '/student/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/company/dashboard')}`}
                            >
                                Dashboard
                            </Link>
                            <div className="flex items-center space-x-3 ml-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-semibold text-white">
                                        {user.name || user.fullName || user.email}
                                    </span>
                                    <span className="text-xs text-gray-400 capitalize">
                                        {user.role}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-300 hover:text-white hover:bg-red-600 px-3 py-2 rounded-md transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/student/login" className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md transition-all font-medium">
                                Student
                            </Link>
                            <Link to="/company/login" className="text-white border border-gray-600 hover:border-white hover:bg-gray-800 px-4 py-2 rounded-md transition-all font-medium">
                                Company
                            </Link>
                            <Link to="/admin/login" className="text-white border border-amber-600 hover:bg-amber-700 hover:border-amber-500 px-4 py-2 rounded-md transition-all font-medium">
                                Admin
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Button - simplified */}
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <i className="ri-menu-line ri-lg"></i>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
