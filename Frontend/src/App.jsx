import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import StudentLayout from './pages/student/StudentLayout';
import StudentOverview from './pages/student/StudentOverview';
import StudentProfile from './pages/student/StudentProfile';
import CompanyLogin from './pages/CompanyLogin';
import CompanyRegister from './pages/CompanyRegister';
import CompanyLayout from './pages/company/CompanyLayout';
import CompanyOverview from './pages/company/CompanyOverview';
import CompanyPostJob from './pages/company/CompanyPostJob';
import CompanyJobs from './pages/company/CompanyJobs';
import StudentJobApplication from './pages/student/StudentJobApplication';
import StudentJobs from './pages/student/StudentJobs';
import PublicJobs from './pages/PublicJobs';

// Placeholder components for routes we haven't built yet
const ComingSoon = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center">
    <h1 className="text-3xl font-bold">{title} - Coming Soon</h1>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<PublicJobs />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentOverview />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="jobs" element={<StudentJobs />} />
            <Route path="apply/:jobId" element={<StudentJobApplication />} />
            <Route path="applications" element={<ComingSoon title="Applications" />} />
          </Route>

          {/* Company Routes */}
          <Route path="/company" element={<CompanyLayout />}>
            <Route path="dashboard" element={<CompanyOverview />} />
            <Route path="post-job" element={<CompanyPostJob />} />
            <Route path="jobs" element={<CompanyJobs />} />
            <Route path="jobs/edit/:id" element={<CompanyPostJob />} />
            <Route path="applicants" element={<ComingSoon title="Applicants" />} />
          </Route>

          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;