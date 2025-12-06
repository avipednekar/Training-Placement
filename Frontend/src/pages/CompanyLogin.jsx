import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CompanyLogin = () => {
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
            const response = await api.post('/company/login', { email, password });
            const { loggedIncompany, accessToken } = response.data;

            const user = {
                ...loggedIncompany,
                token: accessToken,
                role: 'company'
            };

            login(user);
            navigate('/company/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-row-reverse bg-gray-50">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-16">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-12">
                        <Link to="/">
                            <img src="/assets/logo-wide.png" alt="Logo" className="h-16 mx-auto mb-5" />
                        </Link>
                        <h2 className="text-3xl font-semibold text-gray-800 mb-3">Company Portal</h2>
                        <p className="text-lg text-gray-500">Recruiter Access</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input
                            type="email"
                            required
                            className="w-full p-4 border border-gray-200 rounded text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            placeholder="Company Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            required
                            className="w-full p-4 border border-gray-200 rounded text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-button font-medium text-lg hover:bg-blue-600 transition-colors disabled:opacity-70"
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>

                        <div className="text-center mt-6">
                            <p className="text-gray-500 text-sm">
                                New company?{' '}
                                <Link to="/company/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/800x1200/F0FDFA/0F766E?text=Find+Top+Talent')" }}></div>
        </div>
    );
};

export default CompanyLogin;
