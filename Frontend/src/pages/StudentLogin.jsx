import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/student/login', { email, password });
            const { loggedInuser, accessToken } = response.data;

            const user = {
                ...loggedInuser,
                name: loggedInuser.fullName, // Map backend fullName to frontend expected name
                token: accessToken,
                role: 'student'
            };

            login(user);
            navigate('/student/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Form Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-16">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-12">
                        <Link to="/">
                            <img src="/assets/logo-wide.png" alt="Logo" className="h-16 mx-auto mb-5" />
                        </Link>
                        <h2 className="text-3xl font-semibold text-gray-800 mb-3">Welcome Back</h2>
                        <p className="text-lg text-gray-500">Login to your placement portal account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <i className="ri-mail-line text-gray-400 text-xl"></i>
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded text-gray-700 text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                placeholder="College Email (e.g., student@college.edu)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <i className="ri-lock-line text-gray-400 text-xl"></i>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded text-gray-700 text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-button font-medium text-lg hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-gray-500 text-sm">
                                Don't have an account?{' '}
                                <Link to="/student/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Image Section */}
            <div
                className="hidden md:block w-1/2 bg-cover bg-center"
                style={{ backgroundImage: "url('https://placehold.co/800x1200/E0F2FE/0C4A6E?text=Student+Portal')" }}
            ></div>
        </div>
    );
};

export default StudentLogin;
