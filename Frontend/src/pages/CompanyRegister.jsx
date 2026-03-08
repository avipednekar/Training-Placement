import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import SelectField from '../components/ui/SelectField';
import { validateCompanyRegister } from '../utils/validation';

const CompanyRegister = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
        website: '',
        location: '',
        description: ''
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
        const { isValid, errors } = validateCompanyRegister(formData);
        if (!isValid) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);

        try {
            await api.post('/company/register', {
                name: formData.companyName,
                email: formData.email,
                password: formData.password,
                domain: formData.website, // Mapping website to domain as per backend schema likely
                address: formData.location, // Mapping location to address
                description: formData.description
            });

            setSuccess("Company account created successfully! Redirecting to login...");
            setTimeout(() => navigate('/company/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 flex-row-reverse">
            {/* Form Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-16">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <Link to="/">
                            <img src="/assets/logo-wide.png" alt="Logo" className="h-16 mx-auto mb-5" />
                        </Link>
                        <h2 className="text-3xl font-semibold text-gray-800 mb-3">Register Company</h2>
                        <p className="text-lg text-gray-500">Find top talent for your organization</p>
                    </div>

                    {error && <div className="mb-6 p-4 rounded bg-red-50 text-red-600 text-center">{error}</div>}
                    {success && <div className="mb-6 p-4 rounded bg-green-50 text-green-600 text-center">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <TextField
                            name="companyName"
                            placeholder="Company Name"
                            value={formData.companyName}
                            onChange={handleChange}
                            error={fieldErrors.companyName}
                        />
                        <TextField
                            name="email"
                            type="email"
                            placeholder="Work Email"
                            value={formData.email}
                            onChange={handleChange}
                            error={fieldErrors.email}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField
                                name="website"
                                placeholder="Website"
                                value={formData.website}
                                onChange={handleChange}
                            />
                            <TextField
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                                error={fieldErrors.location}
                            />
                        </div>

                        <textarea
                            name="description"
                            placeholder="About Company"
                            rows="3"
                            className="w-full p-4 border rounded focus:ring-2 focus:ring-primary outline-none"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        <Button type="submit" loading={loading} fullWidth>
                            Create Account
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-gray-500">
                        Already registered? <Link to="/company/login" className="text-primary font-medium">Log in</Link>
                    </p>
                </div>
            </div>
            <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/assets/company-auth-new-bg.png')" }}></div>
        </div>
    );
};

export default CompanyRegister;
