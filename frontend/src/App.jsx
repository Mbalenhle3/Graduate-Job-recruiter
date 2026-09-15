import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PortalLayout from "./components/layout/PortalLayout";
import useAuth from "./hooks/useAuth";
import {
  ROLE_HOME,
  initialApplications,
  initialEmployerJobs,
  initialEmployers,
} from "./data/mockData";
import {
  ForgotPasswordPage,
  RegisterPage,
  ResetPasswordPage,
  SignInPage,
} from "./pages/auth";
import {
  ApplicationsPage,
  JobDetailsPage,
  JobSeekerDashboard,
  JobSeekerProfilePage,
  JobsPage,
  SavedJobsPage,
} from "./pages/job-seeker";
import {
  ApplicantsPage,
  EmployerDashboard,
  EmployerOpportunitiesPage,
  NewOpportunityPage,
  OrganisationProfilePage,
} from "./pages/employer";
import {
  AdminDashboard,
  EmployerVerificationPage,
  OpportunityReviewPage,
  ReportsPage,
  UserManagementPage,
} from "./pages/admin";

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [saved, setSaved] = useState(["1", "5"]);
  const [applications, setApplications] = useState(initialApplications);
  const [employerJobs, setEmployerJobs] = useState(initialEmployerJobs);
  const [employers, setEmployers] = useState(initialEmployers);

  const toggleSaved = (id) => {
    setSaved((list) =>
      list.includes(id)
        ? list.filter((item) => item !== id)
        : [...list, id],
    );
  };

  const apply = (job) => {
    setApplications((list) =>
      list.some((item) => item.jobId === job.id)
        ? list
        : [
            {
              id: `a${Date.now()}`,
              jobId: job.id,
              title: job.title,
              company: job.company,
              date: "10 Sep 2026",
              status: "Applied",
            },
            ...list,
          ],
    );
  };

  function protectedPage(role, page) {
    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== role) {
      return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;
    }

    return (
      <PortalLayout role={role} onLogout={signOut}>
        {page}
      </PortalLayout>
    );
  }

  if (loading) {
    return <div className="app-loading">Checking your session...</div>;
  }

  const home = user ? ROLE_HOME[user.role] : "/login";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={home} replace />} />
      <Route path="/login" element={user ? <Navigate to={home} replace /> : <SignInPage />} />
      <Route path="/register" element={user ? <Navigate to={home} replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={user ? <Navigate to={home} replace /> : <ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/job-seeker/dashboard" element={protectedPage("job_seeker", <JobSeekerDashboard applications={applications} savedCount={saved.length} />)} />
      <Route path="/job-seeker/jobs" element={protectedPage("job_seeker", <JobsPage saved={saved} onToggleSaved={toggleSaved} />)} />
      <Route path="/job-seeker/jobs/:id" element={protectedPage("job_seeker", <JobDetailsPage saved={saved} onToggleSaved={toggleSaved} onApply={apply} />)} />
      <Route path="/job-seeker/applications" element={protectedPage("job_seeker", <ApplicationsPage applications={applications} />)} />
      <Route path="/job-seeker/saved" element={protectedPage("job_seeker", <SavedJobsPage saved={saved} onToggleSaved={toggleSaved} />)} />
      <Route path="/job-seeker/profile" element={protectedPage("job_seeker", <JobSeekerProfilePage />)} />

      <Route path="/employer/dashboard" element={protectedPage("employer", <EmployerDashboard opportunities={employerJobs} />)} />
      <Route path="/employer/opportunities" element={protectedPage("employer", <EmployerOpportunitiesPage opportunities={employerJobs} setOpportunities={setEmployerJobs} />)} />
      <Route path="/employer/opportunities/new" element={protectedPage("employer", <NewOpportunityPage setOpportunities={setEmployerJobs} />)} />
      <Route path="/employer/applicants" element={protectedPage("employer", <ApplicantsPage />)} />
      <Route path="/employer/profile" element={protectedPage("employer", <OrganisationProfilePage />)} />

      <Route path="/admin/dashboard" element={protectedPage("admin", <AdminDashboard employers={employers} />)} />
      <Route path="/admin/employers" element={protectedPage("admin", <EmployerVerificationPage employers={employers} setEmployers={setEmployers} />)} />
      <Route path="/admin/opportunities" element={protectedPage("admin", <OpportunityReviewPage />)} />
      <Route path="/admin/users" element={protectedPage("admin", <UserManagementPage />)} />
      <Route path="/admin/reports" element={protectedPage("admin", <ReportsPage />)} />
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}
