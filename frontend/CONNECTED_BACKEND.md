# GraduateLink SA frontend connection

## Backend address

The backend address is stored once in `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart Vite after changing this value.

## Connected features

- Account registration: `POST /api/auth/signup`
- Account sign-in: `POST /api/auth/signin`
- Current session validation: `GET /api/auth/me`
- Forgot password email: `POST /api/auth/forgot-password`
- Password reset: `POST /api/auth/reset-password`
- View job-seeker profile: `GET /api/job-seekers/me/profile`
- Save job-seeker profile: `PUT /api/job-seekers/me/profile`
- Bearer token added automatically to protected API requests
- Role-based route protection using the role returned by FastAPI

## Run locally

Start FastAPI from the `backend` folder:

```powershell
python -m uvicorn app.main:app --reload
```

Start React from the `frontend` folder:

```powershell
npm install
npm run dev
```

## Still awaiting backend endpoints

The opportunity, application, saved-job, employer, administrator and CV-upload
screens still display prototype data. They must be connected as their FastAPI
models and endpoints are implemented.
