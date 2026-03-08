const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'SDE at TCS',
    quote:
      'This platform made the application process so smooth. I got placed within 2 weeks!',
    initial: 'R',
    color: 'bg-orange-500',
  },
  {
    name: 'Priya Patel',
    role: 'Analyst at Infosys',
    quote:
      'The direct connection with recruiters was a game changer for me. Highly recommended.',
    initial: 'P',
    color: 'bg-purple-500',
  },
  {
    name: 'Amit Kumar',
    role: 'DevOps at Wipro',
    quote:
      'Amazing experience. The layout and features are top-notch and very user friendly.',
    initial: 'A',
    color: 'bg-blue-500',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Success Stories</h2>
          <p className="text-gray-600 mt-4">
            Hear from students who found their dream jobs
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ name, role, quote, initial, color }) => (
  <div className="bg-gray-50 p-8 rounded-2xl max-w-sm flex-1 min-w-[300px] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
    <div className="flex items-center mb-6">
      <div
        className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-white font-bold text-xl mr-4`}
      >
        {initial}
      </div>
      <div>
        <h4 className="font-bold text-gray-800">{name}</h4>
        <p className="text-xs text-primary font-semibold">{role}</p>
      </div>
    </div>
    <p className="text-gray-600 italic leading-relaxed">"{quote}"</p>
  </div>
);

export default TestimonialsSection;

