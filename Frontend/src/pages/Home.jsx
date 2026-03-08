import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import AboutSection from '../components/home/AboutSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import LatestJobsSection from '../components/home/LatestJobsSection';
import TopCompaniesSection from '../components/home/TopCompaniesSection';
import usePublicJobs from '../hooks/usePublicJobs';
import usePlatformStats from '../hooks/usePlatformStats';
import useTopCompanies from '../hooks/useTopCompanies';

const Home = () => {
    const { jobs, loading: jobsLoading } = usePublicJobs({ limit: 6 });
    const { stats, loading: statsLoading } = usePlatformStats();
    const { companies, loading: companiesLoading } = useTopCompanies();

    const isLoading = jobsLoading || statsLoading || companiesLoading;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <HeroSection />
            <StatsSection jobs={stats.jobs} companies={stats.companies} />
            <HowItWorksSection />
            <AboutSection />
            <FeaturesSection />
            <TestimonialsSection />
            <LatestJobsSection jobs={jobs} loading={isLoading} />
            <TopCompaniesSection companies={companies} />

            <Footer />
        </div>
    );
};

export default Home;
