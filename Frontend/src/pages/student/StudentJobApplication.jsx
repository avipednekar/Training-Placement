import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const StudentJobApplication = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', location: '',
        position: '', linkedin: '', portfolio: '', startDate: '',
        source: '', relocate: 'yes', workAuthorization: 'yes', additionalNotes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (file) data.append('resume', file);
            if (jobId) data.append('jobId', jobId);

            // Assuming an endpoint exists or just simulating success for now as per legacy
            // await api.post('/student/apply', data);

            alert('Application Submitted Successfully!');
            navigate('/student/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Job Application Form</h2>
            <p className="text-gray-600 mb-8">Complete the form below to apply. * indicates required fields.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="firstName" placeholder="First Name *" required className="p-3 border rounded w-full" onChange={handleChange} />
                    <input name="lastName" placeholder="Last Name *" required className="p-3 border rounded w-full" onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="email" type="email" placeholder="Email Address *" required className="p-3 border rounded w-full" onChange={handleChange} />
                    <input name="phone" placeholder="Phone Number *" required className="p-3 border rounded w-full" onChange={handleChange} />
                </div>

                <input name="location" placeholder="Current Location *" required className="p-3 border rounded w-full" onChange={handleChange} />

                <select name="position" required className="p-3 border rounded w-full bg-white" onChange={handleChange}>
                    <option value="">Select Position Applying For *</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Data Scientist">Data Scientist</option>
                </select>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="linkedin" placeholder="LinkedIn URL" className="p-3 border rounded w-full" onChange={handleChange} />
                    <input name="portfolio" placeholder="Portfolio URL" className="p-3 border rounded w-full" onChange={handleChange} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Start Date *</label>
                    <input name="startDate" type="date" required className="p-3 border rounded w-full" onChange={handleChange} />
                </div>

                <div className="border border-dashed border-gray-300 p-6 rounded-lg text-center">
                    <i className="ri-file-upload-line text-3xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600 mb-4">Upload Resume (PDF/DOCX)</p>
                    <input type="file" accept=".pdf,.docx" required onChange={handleFileChange} className="hidden" id="resume-upload" />
                    <label htmlFor="resume-upload" className="bg-primary text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">Browse Files</label>
                    {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
                </div>

                <textarea name="additionalNotes" rows="4" placeholder="Additional Notes..." className="p-3 border rounded w-full" onChange={handleChange}></textarea>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded hover:bg-blue-600 disabled:opacity-70">
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentJobApplication;
