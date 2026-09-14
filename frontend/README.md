# GraduateLink SA Frontend

React prototype for the GraduateLink SA final-year project proposal.

## Included user journeys

- Job seeker: dashboard, opportunity search and filters, explainable matching, saved jobs, application tracking, career profile and limited GradBot guidance.
- Employer: approved-organisation dashboard, opportunity management, opportunity posting and applicant review.
- Administrator: employer verification, opportunity moderation, user management and report moderation.

## Source-code arrangement

```text
src/
├── components/
│   ├── common/          Shared interface components
│   └── layout/          Role dashboard layout and navigation
├── data/                Demonstration data and route constants
├── pages/
│   ├── auth/            One file for each authentication page
│   ├── job-seeker/      One file for each Job Seeker page
│   ├── employer/        One file for each Employer page
│   └── admin/           Administrator pages only
│       ├── AdminDashboard.jsx
│       ├── EmployerVerificationPage.jsx
│       ├── OpportunityReviewPage.jsx
│       ├── UserManagementPage.jsx
│       ├── ReportsPage.jsx
│       └── index.js     Simple page exports
└── App.jsx              Routes, session state and shared actions only
```

Every screen has its own file. Each role folder contains only pages for that role, and each folder has a small `index.js` for clean imports. The website opens on the sign-in page, and the account role controls which routes can be accessed.

The interface currently uses realistic demonstration data. It is ready to connect to the selected backend through a REST API after the team finalises the backend technology.

## Authentication prototype

- The landing page is public, but all platform tools require sign-in.
- Public registration supports Job Seeker and Employer accounts only.
- Administrator accounts are created internally and can only use the sign-in page.
- Protected routes send signed-out visitors to sign-in.
- A signed-in account can only access routes allowed for its role.
- Employer registration explains that organisation verification is required before publishing opportunities.
- Password-reset confirmation is demonstrated on the forgot-password page.
- Job seekers can update profile fields, skills, projects and the selected CV, save/apply for opportunities, track applications and report a suspicious listing.
- Employers can complete an organisation profile, select a verification document, submit it for review, create/edit/close opportunities, review applicants and change application statuses.
- Administrators can approve/reject employers and opportunities, suspend/restore users, investigate reports and remove reported content.

The current sign-in is a frontend demonstration. The backend must later verify passwords, issue secure sessions or tokens, and enforce the same role permissions on every API endpoint.

Profile changes are saved in browser local storage for frontend testing. The Job Seeker profile includes contact details, education, career preferences, skills, projects and a CV. The Employer profile includes contact, registration, industry, location, company description and verification information. The opportunity form captures all listing fields before adding a Pending opportunity.

## Run the project

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

Use the account-type selector on the prototype sign-in page to test each role. The role selector is provided only for testing; in the final system, the backend will read the role stored on the user's account.
