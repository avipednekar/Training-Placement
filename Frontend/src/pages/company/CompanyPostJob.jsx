import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CompanyPostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        jobTitle: '', location: '', jobType: 'Full-time',
        vacancies: '', salary: '', eligibility: '',
        skillsRequired: '', deadline: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/jobs/create', {
                title: formData.jobTitle,
                location: formData.location,
                jobType: formData.jobType,
                requirements: formData.skillsRequired.split(',').map(s => s.trim()),
                salary: formData.salary,
                deadline: formData.deadline,
                description: `Eligibility: ${formData.eligibility}` // Mapping simply for now
            });
            alert('Job Posted Successfully!');
            navigate('/company/dashboard');
        } catch (error) {
            console.error("Error posting job:", error);
            alert('Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input name="jobTitle" required className="w-full p-3 border rounded" placeholder="e.g. Senior Software Engineer" onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input name="location" required className="w-full p-3 border rounded" placeholder="e.g. Remote" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                        <select name="jobType" className="w-full p-3 border rounded bg-white" onChange={handleChange}>
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Internship</option>
                            <option>Contract</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                        <input name="salary" className="w-full p-3 border rounded" placeholder="e.g. $80k - $100k" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vacancies</label>
                        <input name="vacancies" type="number" className="w-full p-3 border rounded" onChange={handleChange} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (comma separated)</label>
                    <input name="skillsRequired" className="w-full p-3 border rounded" placeholder="React, Node.js, MongoDB" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                    <textarea name="eligibility" className="w-full p-3 border rounded" rows="2" placeholder="e.g. B.Tech CSE, > 7.0 CGPA" onChange={handleChange}></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                    <input name="deadline" type="date" required className="w-full p-3 border rounded" onChange={handleChange} />
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded hover:bg-blue-600 disabled:opacity-70">
                        {loading ? 'Posting...' : 'Post Job'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyPostJob;
