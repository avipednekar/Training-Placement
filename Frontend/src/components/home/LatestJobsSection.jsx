import { Link } from 'react-router-dom';
import JobCard from '../JobCard';

const LatestJobsSection = ({ jobs, loading }) => {
  return (
    <section id="jobs" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest Job Openings</h2>
            <p className="text-gray-600">Fresh opportunities added every day</p>
          </div>
          <Link to="/jobs" className="hidden md:block">
            <span className="text-primary font-semibold flex items-center hover:underline">
              View All Jobs <i className="ri-arrow-right-line ml-2" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <div className="col-span-full text-center">Loading...</div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <EmptyJobsState />
          )}
        </div>

        <div className="text-center md:hidden">
          <Link to="/jobs">
            <button className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
              View All Jobs
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const EmptyJobsState = () => (
  <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
    <i className="ri-briefcase-line text-6xl text-gray-300 mb-4 block" />
    <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Job Postings</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      We couldn&apos;t find any open positions at the moment. Check back later or subscribe
      to alerts.
    </p>
    <button className="text-primary font-semibold hover:underline">
      Subscribe to Job Alerts <i className="ri-notification-3-line ml-1" />
    </button>
  </div>
);

export default LatestJobsSection;

