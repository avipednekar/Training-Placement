import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50" />
            <img
              src="/assets/about-platform.png"
              alt="Platform Overview"
              className="relative rounded-2xl shadow-2xl w-full rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Connecting Talent with Opportunity
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Our platform bridges the gap between talented students and leading companies,
              streamlining the recruitment process for everyone involved.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-700">
                <i className="ri-checkbox-circle-fill text-green-500 mr-3 text-xl" />
                Verified Companies and Students
              </li>
              <li className="flex items-center text-gray-700">
                <i className="ri-checkbox-circle-fill text-green-500 mr-3 text-xl" />
                Real-time Application Tracking
              </li>
              <li className="flex items-center text-gray-700">
                <i className="ri-checkbox-circle-fill text-green-500 mr-3 text-xl" />
                Seamless Communication
              </li>
            </ul>
            <div className="flex gap-4">
              <Link to="/student/register">
                <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark shadow-lg shadow-blue-500/30 transition-all">
                  Join as Student
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

