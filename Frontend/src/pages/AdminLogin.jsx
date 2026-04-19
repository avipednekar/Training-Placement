import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/admin/login', { email, password });
            const { adminUser, accessToken } = response.data;

            login({
                ...adminUser,
                token: accessToken,
                role: 'admin',
            });

            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Admin login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-16">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-12">
                        <Link to="/">
                            <img src="/assets/logo-wide.png" alt="Logo" className="h-16 mx-auto mb-5" />
                        </Link>
                        <h2 className="text-3xl font-semibold text-gray-800 mb-3">Admin Access</h2>
                        <p className="text-lg text-gray-500">Central placement management dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <TextField
                            name="email"
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button type="submit" loading={loading} fullWidth>
                            Log in
                        </Button>
                    </form>
                </div>
            </div>
            <div className="hidden md:block w-1/2 bg-slate-900"></div>
        </div>
    );
};

export default AdminLogin;
