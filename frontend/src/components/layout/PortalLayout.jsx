import { useState } from "react";
import { NavLink } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { Icon, Logo } from "../common/AppUI";
import NotificationsPanel from "../common/NotificationsPanel";


const navigation = {
  job_seeker: [
    [
      "Overview",
      "/job-seeker/dashboard",
      "chart",
    ],
    [
      "Find opportunities",
      "/job-seeker/jobs",
      "briefcase",
    ],
    [
      "Applications",
      "/job-seeker/applications",
      "doc",
    ],
    [
      "Saved jobs",
      "/job-seeker/saved",
      "bookmark",
    ],
    [
      "Career profile",
      "/job-seeker/profile",
      "user",
    ],
  ],

  employer: [
    [
      "Overview",
      "/employer/dashboard",
      "chart",
    ],
    [
      "My opportunities",
      "/employer/opportunities",
      "briefcase",
    ],
    [
      "Post opportunity",
      "/employer/opportunities/new",
      "plus",
    ],
    [
      "Applicants",
      "/employer/applicants",
      "user",
    ],
    [
      "Organisation profile",
      "/employer/profile",
      "shield",
    ],
  ],

  admin: [
    [
      "Overview",
      "/admin/dashboard",
      "chart",
    ],
    [
      "Employer verification",
      "/admin/employers",
      "shield",
    ],
    [
      "Opportunity review",
      "/admin/opportunities",
      "briefcase",
    ],
    [
      "Users",
      "/admin/users",
      "user",
    ],
    [
      "Reports",
      "/admin/reports",
      "doc",
    ],
    ["Appeals", "/admin/appeals", "doc"],
    ["Support", "/admin/support", "doc"],
    ["My profile", "/admin/profile", "user"],
  ],
};


const roleNames = {
  job_seeker: "Job Seeker",
  employer: "Employer",
  admin: "Administrator",
};


const defaultInitials = {
  job_seeker: "JS",
  employer: "EM",
  admin: "AD",
};


export default function PortalLayout({
  role,
  onLogout,
  children,
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const fullName = [
    user?.first_name,
    user?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const userInitials = [
    user?.first_name?.charAt(0),
    user?.last_name?.charAt(0),
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const displayedName =
    fullName || roleNames[role] || "User";

  const displayedInitials =
    userInitials ||
    defaultInitials[role] ||
    "U";

  const roleNavigation =
    navigation[role] || [];

  return (
    <div className="shell">
      <aside
        className={
          open
            ? "sidebar open"
            : "sidebar"
        }
      >
        <div className="side-head">
          <Logo />

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="role-chip">
          <i className={role} />

          <span>
            <small>
              {roleNames[role]}
            </small>

            <b>{displayedName}</b>
          </span>
        </div>

        <nav>
          {roleNavigation.map(
            ([label, path, icon]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() =>
                  setOpen(false)
                }
              >
                <Icon name={icon} />
                {label}
              </NavLink>
            )
          )}
        </nav>

        <div className="side-foot">
          <button
            type="button"
            onClick={onLogout}
          >
            <Icon name="logout" />
            Sign out
          </button>

          <small>
            GraduateLink SA
          </small>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div className="workspace">
        <header>
          <button
            type="button"
            className="menu"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>

          <div className="global-search">
            <Icon name="search" />

            <span>
              Search GraduateLink
            </span>
          </div>

          <div className="workspace-actions">
            <span className="signed-role">
              {roleNames[role]}
            </span>

            <NotificationsPanel />

            <div
              className="avatar"
              title={displayedName}
            >
              {displayedInitials}
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
