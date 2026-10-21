<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:lifedispatch-project-rules -->

## LifeDispatch — Project Architecture & Permanent Rules

### What Is This Project?
LifeDispatch is a **production-grade Emergency Medical Dispatch (EMS) web application**.
It coordinates the full lifecycle of a medical emergency — from patient distress call → dispatcher assignment → ambulance dispatch → hospital delivery → payment.

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 7 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Base UI |
| Forms | TanStack Form v1 |
| Data Fetching | TanStack Query v5 |
| HTTP Client | `ofetch` (via `src/lib/apiClient.ts`) |
| Validation | Zod v4 |
| Linter/Formatter | Biome |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Toasts | Sonner |

### The 6 User Roles (RBAC)
| Role | Dashboard URL | Description |
|---|---|---|
| `SUPER_ADMIN` | `/dashboard/super-admin` | Platform owner — users, analytics, audit logs |
| `ADMIN` | `/dashboard/admin` | Operations — fleet, hospitals, emergencies, users |
| `DISPATCHER` | `/dashboard/dispatcher` | Emergency triage — prioritise & assign ambulances |
| `DRIVER` | `/dashboard/driver` | Field crew — accept dispatches, update trip status |
| `HOSPITAL_STAFF` | `/dashboard/hospital-staff` | ER management — staff roster, shift schedule |
| `PATIENT` | `/dashboard/patient` | Service consumer — request, track, pay |

### API Layer Conventions
- **Base URL**: read from `process.env.NEXT_PUBLIC_API_BASE_URL`
- **API client**: `src/lib/apiClient.ts` — uses `ofetch` with `credentials: "include"` (HTTP-only cookies)
- **API functions**: `src/api/auth.api.ts` (only auth so far) — more files will be added per feature
- **Hooks**: TanStack Query/Mutation hooks in `src/hooks/auth.hook.ts`
- **Session**: `useGetMe()` → calls `GET /auth/me` → returns `{ data: { user: { id, name, role, ... } } }`
- **No Zustand**: user state lives in TanStack Query cache (`["user", "me"]`) — do NOT add Zustand

### Auth Endpoints (Backend — 100% complete)
| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | Register (PATIENT role only, OTP email sent) |
| POST | `/auth/verify-email` | Verify OTP to activate account |
| POST | `/auth/login` | Login → sets HTTP-only cookie session |
| POST | `/auth/logout` | Clear session |
| GET | `/auth/me` | Get logged-in user info |
| POST | `/auth/forgot-password` | Send OTP for password reset |
| POST | `/auth/reset-password` | Reset password with OTP |

### Frontend Folder Structure
```
src/
  api/         # Raw API call functions (ofetch)
  app/         # Next.js App Router pages
    (public)/
      (auth)/  # login, register, forgot-password, reset-password
      (marketting)/ # about-us, contact-us
    dashboard/
      super-admin/  # Overview, users, audit-logs
      admin/        # Overview, ambulances, drivers, emergencies, hospitals, users, audit-logs
      dispatcher/   # Overview, dispatch, ambulances
      driver/       # Overview, trips, profile
      hospital-staff/ # Overview, staff, shift
      patient/      # Overview, history, payment
  components/
    forms/     # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, CreateEmergencyForm
    layout/    # Sidebar, Topbar, DashboardShell, Navbar, Footer, MobileDrawer
    shared/    # Reusable views (UserManagementView, AuditLogsView, etc.)
    ui/        # shadcn/ui primitives
    home/      # Marketing landing page sections
  hooks/       # TanStack Query hooks (auth.hook.ts)
  lib/
    apiClient.ts   # ofetch instance
    dummy/         # Seed/mock data (ambulances, drivers, emergencies, trips, etc.)
    types/         # Shared TypeScript enums and types
    utils.ts       # cn() and utility helpers
  providers/   # React Query provider
  validations/ # Zod schemas
```

### Important Coding Rules
1. **Always read `node_modules/next/dist/docs/`** before writing any Next.js-specific code — this version has breaking changes.
2. **Never use `credentials: "include"` manually** — the `apiClient` already sets this globally.
3. **Role-to-URL mapping** lives in `LoginForm.tsx` → `getRoleDashboardPath()`. If new roles are added, update this function.
4. **Sidebar nav** is role-aware via `usePathname()` — no prop drilling needed.
5. **Topbar** currently shows hardcoded dummy user names — needs to be wired to `useGetMe()` in a future task.
6. **Dummy data** in `src/lib/dummy/` is used across all dashboards — all dashboards currently show UI with seed data, not real API data.
7. **Biome** is the linter — run `npm run check` to auto-fix. Avoid `switch` case fall-through and unused variables.
8. **Image hosting**: Remote images are loaded from `i.ibb.co` (configured in `next.config.ts`).
9. **No authentication middleware** exists on the frontend yet — route protection (redirect unauthenticated users to `/login`) is a future task.

<!-- END:lifedispatch-project-rules -->
