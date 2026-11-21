# Project

- The repository contains project documentation under `docs/`, research and visual references under `references/`, a React/Vite frontend under `frontend/`, and a NestJS backend under `backend/`.
- The technical stack is defined in `docs/requirements.md`.
- The frontend and backend use npm and include their own `package.json` and `package-lock.json` files.
- The directory is not currently a Git repository.

# Working Rules

- Base implementation decisions on files present in the repository.
- Follow the confirmed requirements in `docs/requirements.md`.
- Do not assume an architecture or text-management approach until repository files confirm it.
- Preserve the existing visual reference images unless a change is explicitly requested.

# Validation

- Frontend: run `npm.cmd run dev`, `npm.cmd run build`, and `npm.cmd run lint` from `frontend/`.
- Backend: run `npm.cmd run start:dev`, `npm.cmd run build`, `npm.cmd run lint`, and `npm.cmd run test` from `backend/`.
- Confirm additional commands from repository manifests or documentation before running them.

# Safety

- Do not delete or overwrite existing assets without explicit authorization.
- Do not add credentials, secrets, or environment-specific values to tracked files.
