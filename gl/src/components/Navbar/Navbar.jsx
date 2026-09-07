import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // =========================================================
  // CHECK LOGIN STATUS
  // =========================================================

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Unable to load user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("user");

    setUser(null);

    closeMenu();

    navigate("/login");
  };

  // =========================================================
  // NAV LINK CLASS
  // =========================================================

  const navLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="logo-main">
            GraduateLink
          </span>

          <span className="logo-sa">
            SA
          </span>
        </Link>


        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className={`menu-toggle ${
            menuOpen ? "active" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>


        {/* =================================================
            NAVIGATION MENU
        ================================================= */}

        <div
          className={`navbar-menu ${
            menuOpen ? "open" : ""
          }`}
        >

          {/* =================================================
              HOME
          ================================================= */}

          <NavLink
            to="/"
            end
            className={navLinkClass}
            onClick={closeMenu}
          >
            Home
          </NavLink>


          {/* =================================================
              JOBS
          ================================================= */}

          <NavLink
            to="/jobs"
            className={navLinkClass}
            onClick={closeMenu}
          >
            Jobs
          </NavLink>


          {/* =================================================
              SAVED JOBS
          ================================================= */}

          <NavLink
            to="/saved-jobs"
            className={navLinkClass}
            onClick={closeMenu}
          >
            Saved Jobs
          </NavLink>


          {/* =================================================
              LOGGED-IN LINKS
          ================================================= */}

          {user && (
            <>

              {/* DASHBOARD */}

              <NavLink
                to="/dashboard"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>


              {/* PROFILE */}

              <NavLink
                to="/profile"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Profile
              </NavLink>


              {/* ADMIN DASHBOARD */}

              <NavLink
                to="/admin"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Admin
              </NavLink>

            </>
          )}


          {/* =================================================
              AUTH SECTION
          ================================================= */}

          <div className="navbar-auth">

            {!user ? (

              <>

                {/* LOGIN */}

                <Link
                  to="/login"
                  className="login-link"
                  onClick={closeMenu}
                >
                  Login
                </Link>


                {/* REGISTER */}

                <Link
                  to="/register"
                  className="register-button"
                  onClick={closeMenu}
                >
                  Register
                </Link>

              </>

            ) : (

              <>

                {/* USER NAME */}

                <span className="navbar-user">
                  Hi, {user.first_name}
                </span>


                {/* LOGOUT */}

                <button
                  type="button"
                  className="navbar-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>

            )}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;