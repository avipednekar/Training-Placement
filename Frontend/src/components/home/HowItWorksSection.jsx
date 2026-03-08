const steps = [
  {
    number: '1',
    title: 'Register Profile',
    icon: 'ri-user-add-line',
    desc: 'Create your student profile and highlight your skills.',
  },
  {
    number: '2',
    title: 'Upload Resume',
    icon: 'ri-file-upload-line',
    desc: 'Upload your latest resume to showcase your experience.',
  },
  {
    number: '3',
    title: 'Apply Jobs',
    icon: 'ri-briefcase-line',
    desc: 'Browse and apply to jobs that match your profile.',
  },
  {
    number: '4',
    title: 'Get Hired',
    icon: 'ri-shake-hands-line',
    desc: 'Clear interviews and kickstart your dream career.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10" />

          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ number, title, icon, desc }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative z-10 hover:-translate-y-2 transition-transform duration-300">
    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-blue-500/30">
      {number}
    </div>
    <div className="mb-4 text-gray-300">
      <i className={`${icon} text-5xl`} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default HowItWorksSection;

