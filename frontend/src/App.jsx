import { Navigate, Route, Routes } from "react-router-dom";
import PortalLayout from "./components/layout/PortalLayout";
import useAuth from "./hooks/useAuth";
import { ROLE_HOME } from "./data/mockData";
import HomePage from "./pages/HomePage";
import { ForgotPasswordPage, RegisterPage, ResetPasswordPage, SignInPage } from "./pages/auth";
import { ApplicationsPage, JobDetailsPage, JobSeekerDashboard, JobSeekerProfilePage, JobsPage, SavedJobsPage } from "./pages/job-seeker";
import { ApplicantsPage, EmployerDashboard, EmployerOpportunitiesPage, NewOpportunityPage, OrganisationProfilePage } from "./pages/employer";
import { AdminDashboard, EmployerVerificationPage, OpportunityReviewPage, ReportsPage, UserManagementPage } from "./pages/admin";
import AdminProfilePage from "./pages/admin/AdminProfilePage";

export default function App() {
  const { user, loading, signOut } = useAuth();
  function protectedPage(role, page) {
    if (!user) return <Navigate to={`/auth/${role === "job_seeker" ? "job-seeker" : role}/signin`} replace />;
    if (user.role !== role) return <Navigate to={ROLE_HOME[user.role] || "/"} replace />;
    return <PortalLayout role={role} onLogout={signOut}>{page}</PortalLayout>;
  }
  if (loading) return <div className="app-loading">Checking your session...</div>;
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/auth/job-seeker/signin" element={user ? <Navigate to={ROLE_HOME[user.role]} replace /> : <SignInPage expectedRole="job_seeker" />} />
    <Route path="/auth/employer/signin" element={user ? <Navigate to={ROLE_HOME[user.role]} replace /> : <SignInPage expectedRole="employer" />} />
    <Route path="/auth/admin/signin" element={user ? <Navigate to={ROLE_HOME[user.role]} replace /> : <SignInPage expectedRole="admin" />} />
    <Route path="/auth/job-seeker/signup" element={user ? <Navigate to={ROLE_HOME[user.role]} replace /> : <RegisterPage fixedRole="job_seeker" />} />
    <Route path="/auth/employer/signup" element={user ? <Navigate to={ROLE_HOME[user.role]} replace /> : <RegisterPage fixedRole="employer" />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} /><Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/login" element={<Navigate to="/" replace />} /><Route path="/register" element={<Navigate to="/" replace />} />
    <Route path="/job-seeker/dashboard" element={protectedPage("job_seeker", <JobSeekerDashboard />)} /><Route path="/job-seeker/jobs" element={protectedPage("job_seeker", <JobsPage />)} /><Route path="/job-seeker/jobs/:id" element={protectedPage("job_seeker", <JobDetailsPage />)} /><Route path="/job-seeker/applications" element={protectedPage("job_seeker", <ApplicationsPage />)} /><Route path="/job-seeker/saved" element={protectedPage("job_seeker", <SavedJobsPage />)} /><Route path="/job-seeker/profile" element={protectedPage("job_seeker", <JobSeekerProfilePage />)} />
    <Route path="/employer/dashboard" element={protectedPage("employer", <EmployerDashboard />)} /><Route path="/employer/opportunities" element={protectedPage("employer", <EmployerOpportunitiesPage />)} /><Route path="/employer/opportunities/new" element={protectedPage("employer", <NewOpportunityPage />)} /><Route path="/employer/applicants" element={protectedPage("employer", <ApplicantsPage />)} /><Route path="/employer/profile" element={protectedPage("employer", <OrganisationProfilePage />)} />
    <Route path="/admin/dashboard" element={protectedPage("admin", <AdminDashboard />)} /><Route path="/admin/employers" element={protectedPage("admin", <EmployerVerificationPage />)} /><Route path="/admin/opportunities" element={protectedPage("admin", <OpportunityReviewPage />)} /><Route path="/admin/users" element={protectedPage("admin", <UserManagementPage />)} /><Route path="/admin/reports" element={protectedPage("admin", <ReportsPage />)} /><Route path="/admin/profile" element={protectedPage("admin", <AdminProfilePage />)} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
