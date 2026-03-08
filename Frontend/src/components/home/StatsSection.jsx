import useCountUp from '../../hooks/useCountUp';

const StatsSection = ({ jobs, companies }) => {
  return (
    <section className="py-16 bg-white relative z-20 -mt-10 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto shadow-xl rounded-2xl bg-white p-8 border border-gray-100">
        <StatCard
          icon="ri-briefcase-line"
          color="text-primary"
          bg="bg-blue-50"
          count={jobs}
          label="Active Job Postings"
        />
        <StatCard
          icon="ri-building-line"
          color="text-purple-600"
          bg="bg-purple-50"
          count={companies}
          label="Registered Companies"
        />
      </div>
    </section>
  );
};

const StatCard = ({ icon, color, bg, count, label }) => {
  const animatedCount = useCountUp(count);
  return (
    <div className="text-center p-4">
      <div
        className={`w-16 h-16 flex items-center justify-center ${bg} rounded-2xl mb-4 mx-auto transform rotate-3 hover:rotate-0 transition-all`}
      >
        <i className={`${icon} ri-2x ${color}`} />
      </div>
      <h3 className="text-4xl font-bold text-gray-800 mb-2">{animatedCount}+</h3>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
};

export default StatsSection;

