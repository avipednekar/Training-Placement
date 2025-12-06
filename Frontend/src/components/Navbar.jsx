import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    {/* Using absolute path to public folder assets */}
                    <img src="/assets/logo-wide.png" className="h-12 md:h-16" alt="Logo" />
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-primary font-medium hover:bg-blue-50 px-3 py-2 rounded-md transition-all">
                        Home
                    </Link>
                    <Link to="/jobs" className="text-gray-700 hover:text-primary hover:bg-blue-50 px-3 py-2 rounded-md transition-all">
                        Jobs
                    </Link>

                    {user ? (
                        <>
                            {user.role === 'student' ? (
                                <Link to="/student/dashboard" className="text-gray-700 hover:text-primary hover:bg-blue-50 px-3 py-2 rounded-md transition-all">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link to="/company/dashboard" className="text-gray-700 hover:text-primary hover:bg-blue-50 px-3 py-2 rounded-md transition-all">
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-all"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/student/login" className="text-gray-700 hover:text-primary hover:bg-blue-50 px-3 py-2 rounded-md transition-all">
                                Student
                            </Link>
                            <Link to="/company/login" className="text-gray-700 hover:text-primary hover:bg-blue-50 px-3 py-2 rounded-md transition-all">
                                Company
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
