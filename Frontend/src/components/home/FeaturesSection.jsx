const features = [
  {
    icon: '/assets/feature-recruitment.png',
    title: 'Smart Job Matching',
    description:
      'Advanced algorithms connect students with jobs that match their skills, interests, and career goals.',
  },
  {
    icon: '/assets/feature-tracking.png',
    title: 'Application Tracking',
    description:
      'Monitor your application status in real-time and stay updated on every step of the hiring process.',
  },
  {
    icon: '/assets/feature-connect.png',
    title: 'Direct Company Connect',
    description:
      'Build meaningful connections with recruiters and hiring managers from top companies.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
          Why Choose Us
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Experience a seamless recruitment journey with our comprehensive platform features
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center group">
    <div className="w-24 h-24 mx-auto mb-6 group-hover:scale-110 transition-transform">
      <img src={icon} alt={title} className="w-full h-full object-contain" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default FeaturesSection;

