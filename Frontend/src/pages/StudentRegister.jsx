import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import SelectField from '../components/ui/SelectField';
import { validateStudentRegister } from '../utils/validation';

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
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setFieldErrors({});
        const { isValid, errors } = validateStudentRegister(formData);
        if (!isValid) {
            setFieldErrors(errors);
            return;
        }

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
                        <TextField
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            error={fieldErrors.fullName}
                        />
                        <TextField
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            error={fieldErrors.email}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField
                                name="rollNo"
                                placeholder="Roll Number"
                                value={formData.rollNo}
                                onChange={handleChange}
                                error={fieldErrors.rollNo}
                            />
                            <SelectField
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                error={fieldErrors.branch}
                            >
                                <option value="">Select Branch</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="ECE">ECE</option>
                                <option value="MECH">MECH</option>
                            </SelectField>
                        </div>
                        <TextField
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            error={fieldErrors.password}
                        />
                        <TextField
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={fieldErrors.confirmPassword}
                        />

                        <Button type="submit" loading={loading} fullWidth>
                            Register
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-gray-500">
                        Already have an account? <Link to="/student/login" className="text-primary font-medium">Log in</Link>
                    </p>
                </div>
            </div>
            <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/assets/student-auth-bg.png')" }}></div>
        </div>
    );
};

export default StudentRegister;
