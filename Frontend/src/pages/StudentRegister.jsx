import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const StudentRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        rollNo: '',
        branch: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError('');
        setLoading(true);

        try {
            await api.post('/student/register', {
                fullName: formData.fullName,
                email: formData.email,
                rollNo: formData.rollNo,
                branch: formData.branch,
                password: formData.password
            });

            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => navigate('/student/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-16">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <Link to="/">
                            <img src="/assets/logo-wide.png" alt="Logo" className="h-16 mx-auto mb-5" />
                        </Link>
                        <h2 className="text-3xl font-semibold text-gray-800 mb-3">Create Account</h2>
                        <p className="text-lg text-gray-500">Join the placement portal today</p>
                    </div>

                    {error && <div className="mb-6 p-4 rounded bg-red-50 text-red-600 text-center">{error}</div>}
                    {success && <div className="mb-6 p-4 rounded bg-green-50 text-green-600 text-center">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input name="fullName" placeholder="Full Name" required className="w-full p-4 border rounded focus:ring-2 focus:ring-primary outline-none" onChange={handleChange} />
                        <input name="email" type="email" placeholder="Email Address" required className="w-full p-4 border rounded focus:ring-2 focus:ring-primary outline-none" onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="rollNo" placeholder="Roll Number" required className="w-full p-4 border rounded focus:ring-2 focus:ring-primary outline-none" onChange={handleChange} />
                            <select name="branch" required className="w-full p-4 border rounded focus:ring-2 focus:ring-primary outline-none bg-white" onChange={handleChange}>
                                <option value="">Select Branch</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="ECE">ECE</option>
                                <option value="MECH">MECH</option>
                            </select>
                        </div>
                        <input name="password" type="password" placeholder="Password" required className="w-full p-4 border rounded focus:ring-2 focus:ring-primary outline-none" onChange={handleChange} />
                        <input name="confirmPassword" type="password" placeholder="Confirm Password" required className="w-full p-4 border rounded focus:ring-2 focus:ring-primary outline-none" onChange={handleChange} />

                        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded font-medium hover:bg-blue-600 transition-colors disabled:opacity-70">
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-500">
                        Already have an account? <Link to="/student/login" className="text-primary font-medium">Log in</Link>
                    </p>
                </div>
            </div>
            <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/800x1200/E0F2FE/0C4A6E?text=Join+Us')" }}></div>
        </div>
    );
};

export default StudentRegister;
