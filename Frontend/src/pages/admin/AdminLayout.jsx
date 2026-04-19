import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
    };

    const closeMobileNav = () => {
        setIsMobileNavOpen(false);
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: 'ri-dashboard-line', label: 'Eligibility Control' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Header - visible only on small screens */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
                <button
                    onClick={toggleMobileNav}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                    aria-expanded={isMobileNavOpen}
                    aria-controls="mobile-menu"
                    aria-label="Toggle navigation menu"
                >
                    <i className={`ri-${isMobileNavOpen ? 'close' : 'menu'}-line text-2xl`}></i>
                </button>
                <img src="/assets/logo-wide.png" alt="Logo" className="h-8" />
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-md text-red-600 hover:bg-red-50"
                    aria-label="Sign out"
                >
                    <i className="ri-logout-box-line text-xl"></i>
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileNavOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeMobileNav}
                />
            )}

            {/* Mobile Navigation Panel */}
            <aside 
                id="mobile-menu"
                className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out md:hidden ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-center">
                    <img src="/assets/logo-wide.png" alt="Logo" className="h-10" />
                </div>

                <div className="p-6 border-b border-gray-100 text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full mx-auto mb-3 flex items-center justify-center text-amber-700 text-2xl font-bold">
                        A
                    </div>
                    <h3 className="font-semibold text-gray-800">{user?.name || 'Admin'}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={closeMobileNav}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${location.pathname === item.path
                                ? 'bg-amber-50 text-amber-700'
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
                        onClick={() => { handleLogout(); closeMobileNav(); }}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                        <i className="ri-logout-box-line text-lg mr-3"></i>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Desktop Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-center">
                    <img src="/assets/logo-wide.png" alt="Logo" className="h-10" />
                </div>

                <div className="p-6 border-b border-gray-100 text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full mx-auto mb-3 flex items-center justify-center text-amber-700 text-2xl font-bold">
                        A
                    </div>
                    <h3 className="font-semibold text-gray-800">{user?.name || 'Admin'}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${location.pathname === item.path
                                ? 'bg-amber-50 text-amber-700'
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

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
