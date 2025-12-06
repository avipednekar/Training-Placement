import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const CompanyPostJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        jobTitle: '', location: '', jobType: 'Full-time',
        vacancies: '', salary: '', eligibility: '',
        skillsRequired: '', deadline: ''
    });

    useEffect(() => {
        if (isEditMode) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const response = await api.get(`/jobs/${id}`);
            const job = response.data;
            setFormData({
                jobTitle: job.job_title,
                location: job.job_location,
                jobType: job.job_type,
                vacancies: job.vacancy,
                salary: job.salary,
                eligibility: job.criteria, // Mapping criteria to eligibility
                skillsRequired: job.skills.join(', '),
                deadline: job.deadline ? job.deadline.split('T')[0] : ''
            });
        } catch (error) {
            console.error("Error fetching job details:", error);
            alert("Failed to load job details");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                job_title: formData.jobTitle,
                job_location: formData.location,
                job_type: formData.jobType,
                vacancy: formData.vacancies,
                skills: formData.skillsRequired.split(',').map(s => s.trim()),
                salary: formData.salary,
                deadline: formData.deadline,
                criteria: formData.eligibility,
                job_des: `Eligibility: ${formData.eligibility}` // Keeping logic consistent
            };

            if (isEditMode) {
                await api.post('/jobs', { _id: id, ...payload }); // Backend uses same endpoint for create/update based on _id presence
                alert('Job Updated Successfully!');
            } else {
                await api.post('/jobs', payload); // Backend createOrUpdateJob endpoint
                alert('Job Posted Successfully!');
            }
            navigate('/company/jobs');
        } catch (error) {
            console.error("Error posting job:", error);
            alert('Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{isEditMode ? 'Edit Job' : 'Post a New Job'}</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input name="jobTitle" value={formData.jobTitle} required className="w-full p-3 border rounded" placeholder="e.g. Senior Software Engineer" onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input name="location" value={formData.location} required className="w-full p-3 border rounded" placeholder="e.g. Remote" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                        <select name="jobType" value={formData.jobType} className="w-full p-3 border rounded bg-white" onChange={handleChange}>
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
                        <input name="salary" value={formData.salary} className="w-full p-3 border rounded" placeholder="e.g. $80k - $100k" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vacancies</label>
                        <input name="vacancies" value={formData.vacancies} type="number" className="w-full p-3 border rounded" onChange={handleChange} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (comma separated)</label>
                    <input name="skillsRequired" value={formData.skillsRequired} className="w-full p-3 border rounded" placeholder="React, Node.js, MongoDB" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                    <textarea name="eligibility" value={formData.eligibility} className="w-full p-3 border rounded" rows="2" placeholder="e.g. B.Tech CSE, > 7.0 CGPA" onChange={handleChange}></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                    <input name="deadline" value={formData.deadline} type="date" required className="w-full p-3 border rounded" onChange={handleChange} />
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded hover:bg-blue-600 disabled:opacity-70">
                        {loading ? (isEditMode ? 'Updating...' : 'Posting...') : (isEditMode ? 'Update Job' : 'Post Job')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyPostJob;
