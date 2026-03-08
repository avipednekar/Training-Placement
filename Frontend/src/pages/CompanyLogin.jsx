import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import { validateCompanyLogin } from '../utils/validation';

const CompanyLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setLoading(true);

        try {
            const { isValid, errors } = validateCompanyLogin({ email, password });
            if (!isValid) {
                setFieldErrors(errors);
                setLoading(false);
                return;
            }

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
                        <TextField
                            name="email"
                            type="email"
                            placeholder="Company Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={fieldErrors.email}
                        />
                        <TextField
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={fieldErrors.password}
                        />

                        <Button type="submit" loading={loading} fullWidth>
                            Log in
                        </Button>

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
            <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/assets/company-auth-new-bg.png')" }}></div>
        </div>
    );
};

export default CompanyLogin;
