import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        imageUrl: '',
        department: '',
        cgpa: '',
        graduationYear: '',
        currentSemester: '1st Semester, 3rd Year',
        phone: '',
        programmingLanguages: [],
        otherSkills: [],
        certifications: []
    });

    const [inputs, setInputs] = useState({
        techSkill: '',
        softSkill: '',
        certification: ''
    });

    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Fetch Profile Data (Skills, etc.)
            const profileRes = await api.get(`/student/profile/${user.email}`);
            if (profileRes.data) {
                const data = profileRes.data;
                setFormData({
                    imageUrl: data.imageUrl || '',
                    department: data.department || '',
                    cgpa: data.cgpa || '',
                    graduationYear: data.graduationYear || '',
                    currentSemester: data.currentSemester || '1st Semester, 3rd Year',
                    phone: data.phone || '',
                    programmingLanguages: data.programmingLanguages || [],
                    otherSkills: data.otherSkills || [],
                    certifications: data.certifications || []
                });
            }

            // Fetch Student Info (Name, RollNo, etc.)
            const studentRes = await api.get(`/student/info/${user.email}`);
            if (studentRes.data) {
                setStudentName(studentRes.data.fullName);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInputChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const addSkill = (type, key) => {
        const value = inputs[key].trim();
        if (value && !formData[type].includes(value)) {
            setFormData(prev => ({
                ...prev,
                [type]: [...prev[type], value]
            }));
            setInputs(prev => ({ ...prev, [key]: '' }));
        }
    };

    const removeSkill = (type, skill) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter(s => s !== skill)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/student/save-profile', {
                email: user.email,
                ...formData
            });
            alert('Profile saved successfully!');
        } catch (error) {
            console.error("Error saving profile:", error);
            alert('Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Personal Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" value={studentName} disabled className="w-full p-3 bg-gray-50 border rounded text-gray-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="text" value={user?.email} disabled className="w-full p-3 bg-gray-50 border rounded text-gray-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" className="w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Academic Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select name="department" value={formData.department} onChange={handleChange} className="w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none bg-white">
                                    <option value="">Select Department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Mechanical">Mechanical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
                                <select name="currentSemester" value={formData.currentSemester} onChange={handleChange} className="w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none bg-white">
                                    <option>1st Semester</option>
                                    <option>2nd Semester</option>
                                    <option>3rd Semester</option>
                                    <option>4th Semester</option>
                                    <option>5th Semester</option>
                                    <option>6th Semester</option>
                                    <option>7th Semester</option>
                                    <option>8th Semester</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className="w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                                <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Skills & Certifications</h3>

                        {/* Tech Skills */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    name="techSkill"
                                    value={inputs.techSkill}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('programmingLanguages', 'techSkill'))}
                                    placeholder="Add a skill (e.g. Java, Python)"
                                    className="flex-1 p-3 border rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                                <button type="button" onClick={() => addSkill('programmingLanguages', 'techSkill')} className="bg-gray-100 px-4 rounded hover:bg-gray-200 text-gray-700">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.programmingLanguages.map(skill => (
                                    <span key={skill} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill('programmingLanguages', skill)} className="ml-2 hover:text-blue-900">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Soft Skills */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    name="softSkill"
                                    value={inputs.softSkill}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('otherSkills', 'softSkill'))}
                                    placeholder="Add a skill (e.g. Leadership)"
                                    className="flex-1 p-3 border rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                                <button type="button" onClick={() => addSkill('otherSkills', 'softSkill')} className="bg-gray-100 px-4 rounded hover:bg-gray-200 text-gray-700">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.otherSkills.map(skill => (
                                    <span key={skill} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill('otherSkills', skill)} className="ml-2 hover:text-purple-900">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    name="certification"
                                    value={inputs.certification}
                                    onChange={handleInputChange}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('certifications', 'certification'))}
                                    placeholder="Add certification (e.g. AWS Certified)"
                                    className="flex-1 p-3 border rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                                <button type="button" onClick={() => addSkill('certifications', 'certification')} className="bg-gray-100 px-4 rounded hover:bg-gray-200 text-gray-700">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.certifications.map(skill => (
                                    <span key={skill} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill('certifications', skill)} className="ml-2 hover:text-green-900">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 rounded-button hover:bg-blue-600 transition-colors disabled:opacity-70">
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentProfile;
