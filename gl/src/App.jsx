import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar/Navbar";

// Pages
import Home from "./pages/Home/Home";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/JobDetails/JobDetails";
import Apply from "./pages/Apply/Apply";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import SavedJobs from "./pages/SavedJobs/SavedJobs";
import Applications from "./pages/Applications/Applications";

// Admin
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminJobs from "./pages/AdminJobs/AdminJobs";
import AddJob from "./pages/AddJob/AddJob";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* JOBS */}
        <Route
          path="/jobs"
          element={<Jobs />}
        />

        {/* JOB DETAILS */}
        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        {/* APPLY FOR JOB */}
        <Route
          path="/apply/:id"
          element={<Apply />}
        />

        {/* STUDENT DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* APPLICATIONS */}
        <Route
          path="/applications"
          element={<Applications />}
        />

        {/* SAVED JOBS */}
        <Route
          path="/saved-jobs"
          element={<SavedJobs />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* ADMIN JOB MANAGEMENT */}
        <Route
          path="/admin/jobs"
          element={<AdminJobs />}
        />

        {/* ADD NEW JOB */}
        <Route
          path="/admin/jobs/add"
          element={<AddJob />}
        />

      </Routes>
    </>
  );
}

export default App;