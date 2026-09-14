import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PortalLayout from "./components/layout/PortalLayout";
import { ROLE_HOME, initialApplications, initialEmployerJobs, initialEmployers } from "./data/mockData";
import { ForgotPasswordPage, RegisterPage, SignInPage } from "./pages/auth";
import { ApplicationsPage, JobDetailsPage, JobSeekerDashboard, JobSeekerProfilePage, JobsPage, SavedJobsPage } from "./pages/job-seeker";
import { ApplicantsPage, EmployerDashboard, EmployerOpportunitiesPage, NewOpportunityPage, OrganisationProfilePage } from "./pages/employer";
import { AdminDashboard, EmployerVerificationPage, OpportunityReviewPage, ReportsPage, UserManagementPage } from "./pages/admin";

export default function App() {
  const [session,setSession] = useState(null);
  const [saved,setSaved] = useState(["1","5"]);
  const [applications,setApplications] = useState(initialApplications);
  const [employerJobs,setEmployerJobs] = useState(initialEmployerJobs);
  const [employers,setEmployers] = useState(initialEmployers);

  const signIn = role => setSession({ role });
  const signOut = () => setSession(null);
  const toggleSaved = id => setSaved(list=>list.includes(id)?list.filter(item=>item!==id):[...list,id]);
  const apply = job => setApplications(list=>list.some(item=>item.jobId===job.id)?list:[{id:`a${Date.now()}`,jobId:job.id,title:job.title,company:job.company,date:"10 Sep 2026",status:"Applied"},...list]);

  function protectedPage(role,page) {
    if (!session) return <Navigate to="/login" replace/>;
    if (session.role !== role) return <Navigate to={ROLE_HOME[session.role]} replace/>;
    return <PortalLayout role={role} onLogout={signOut}>{page}</PortalLayout>;
  }

  return <Routes>
    <Route path="/" element={<Navigate to={session?ROLE_HOME[session.role]:"/login"} replace/>}/>
    <Route path="/login" element={session?<Navigate to={ROLE_HOME[session.role]} replace/>:<SignInPage onSignIn={signIn}/>}/>
    <Route path="/register" element={session?<Navigate to={ROLE_HOME[session.role]} replace/>:<RegisterPage onSignIn={signIn}/>}/>
    <Route path="/forgot-password" element={session?<Navigate to={ROLE_HOME[session.role]} replace/>:<ForgotPasswordPage/>}/>

    <Route path="/job-seeker/dashboard" element={protectedPage("seeker",<JobSeekerDashboard applications={applications} savedCount={saved.length}/>)}/>
    <Route path="/job-seeker/jobs" element={protectedPage("seeker",<JobsPage saved={saved} onToggleSaved={toggleSaved}/>)}/>
    <Route path="/job-seeker/jobs/:id" element={protectedPage("seeker",<JobDetailsPage saved={saved} onToggleSaved={toggleSaved} onApply={apply}/>)}/>
    <Route path="/job-seeker/applications" element={protectedPage("seeker",<ApplicationsPage applications={applications}/>)}/>
    <Route path="/job-seeker/saved" element={protectedPage("seeker",<SavedJobsPage saved={saved} onToggleSaved={toggleSaved}/>)}/>
    <Route path="/job-seeker/profile" element={protectedPage("seeker",<JobSeekerProfilePage/>)}/>

    <Route path="/employer/dashboard" element={protectedPage("employer",<EmployerDashboard opportunities={employerJobs}/>)}/>
    <Route path="/employer/opportunities" element={protectedPage("employer",<EmployerOpportunitiesPage opportunities={employerJobs} setOpportunities={setEmployerJobs}/>)}/>
    <Route path="/employer/opportunities/new" element={protectedPage("employer",<NewOpportunityPage setOpportunities={setEmployerJobs}/>)}/>
    <Route path="/employer/applicants" element={protectedPage("employer",<ApplicantsPage/>)}/>
    <Route path="/employer/profile" element={protectedPage("employer",<OrganisationProfilePage/>)}/>

    <Route path="/admin/dashboard" element={protectedPage("admin",<AdminDashboard employers={employers}/>)}/>
    <Route path="/admin/employers" element={protectedPage("admin",<EmployerVerificationPage employers={employers} setEmployers={setEmployers}/>)}/>
    <Route path="/admin/opportunities" element={protectedPage("admin",<OpportunityReviewPage/>)}/>
    <Route path="/admin/users" element={protectedPage("admin",<UserManagementPage/>)}/>
    <Route path="/admin/reports" element={protectedPage("admin",<ReportsPage/>)}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
