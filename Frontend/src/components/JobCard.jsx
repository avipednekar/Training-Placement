import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
    // Helper for visual tags
    const getTypeColor = (type) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('intern')) return 'bg-purple-50 text-purple-600 border-purple-100';
        if (t.includes('remote')) return 'bg-blue-50 text-blue-600 border-blue-100';
        return 'bg-green-50 text-green-600 border-green-100'; // Default Full Time
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-xl font-bold text-gray-400 border border-gray-100">
                        {job.companyName ? job.companyName.charAt(0) : 'C'}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.companyName}</p>
                    </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${getTypeColor(job.type)}`}>
                    {job.type}
                </span>
            </div>

            <div className="space-y-2 mb-6 flex-grow">
                <div className="flex items-center text-gray-500 text-sm">
                    <i className="ri-map-pin-line mr-2 w-4"></i>
                    <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <i className="ri-money-dollar-circle-line mr-2 w-4"></i>
                    <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                    <i className="ri-briefcase-line mr-2 w-4"></i>
                    <span>{job.experience}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
                <Link to={`/jobs/${job.id}`} className="block">
                    <button className="w-full bg-white text-primary border border-primary py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-all active:scale-95">
                        View Details
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
