import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section
      className="pt-32 pb-24 relative overflow-hidden bg-center bg-cover"
      style={{ backgroundImage: "url('/assets/hero-bg.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-up">
            Your Gateway to <span className="text-primary-light">Career Success</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 animate-fade-up delay-100 max-w-2xl mx-auto">
            Connect with top employers, discover opportunities, and take the next step in your
            professional journey.
          </p>

          {/* Hero Search */}
          <div className="max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors"></div>
              <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl border border-white/10">
                <i className="ri-search-line text-gray-400 ml-4 text-xl"></i>
                <input
                  type="text"
                  placeholder="Search for 'Software Engineer' or 'Data Analyst'..."
                  className="flex-grow px-4 py-3 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-wrap gap-4 justify-center animate-fade-up delay-300">
            <Link to="/student/login">
              <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all">
                Student Login
              </button>
            </Link>
            <Link to="/company/login">
              <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all">
                Company Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

