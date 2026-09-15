# GraduateLink SA connected frontend

## One backend address

The API address is stored once in `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If the backend runs on another computer, change only this value, for example:

```env
VITE_API_BASE_URL=http://192.168.1.20:8000
```

Restart Vite after changing `.env`.

## Organised home page

Open `http://localhost:5173/`. The user first chooses:

- Job Seeker
- Employer
- Administrator

Each choice opens the correct sign-in page. Job seekers and employers can register. Administrator accounts are created privately by the backend script.

## Connected areas

- Authentication and password reset
- Job-seeker profile and dashboard
- Published opportunities, saved jobs and PDF applications
- Application tracking and withdrawal
- Employer profile and verification document submission
- Employer opportunities and applicant management
- Administrator dashboard, employer verification and opportunity review
- User suspension/reactivation and audit activity
- Notifications for every authenticated role

## Run locally

Backend:

```powershell
cd backend
python -m uvicorn app.main:app --reload
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Use `npm run lint` and `npm run build` to verify the frontend.
