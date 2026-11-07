# Implementation Plan: Zustand State Management Integration (Revision 2)

---

## Summary of Changes in this Revision
1. **Sources List Cleaned & Verified**: Removed unverified blog domains. Replaced with exact, directly verified URLs:
   - Official Zustand Persist documentation for `skipHydration`: `https://zustand.docs.pmnd.rs/integrations/persisting-store-data#skiphydration`.
   - Official Next.js Hydration documentation for two-phase client mounting: `https://nextjs.org/docs/messages/react-hydration-error`.
   - Exact TkDodo URLs: `https://tkdodo.eu/blog/react-query-as-a-state-manager` and `https://tkdodo.eu/blog/deriving-client-state-from-server-state`.
2. **Hydration Execution Separated**: Updated the architecture so `useAppStore.persist.rehydrate()` is called **exactly once** inside [`DashboardShell.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/DashboardShell.tsx). All other components (`Sidebar.tsx`, etc.) subscribe to hydration via a lightweight, read-only `useHasHydrated()` hook.
3. **Alert Watcher Role-Gated with Query Key Reuse**:
   - Gated to authorized operational roles: `DISPATCHER`, `ADMIN`, and `SUPER_ADMIN` (using `useGetMe()`). Roles `PATIENT`, `DRIVER`, and `HOSPITAL_STAFF` are excluded.
   - Reuses the exact query key `["emergencies", { limit: 100 }]` used by `DispatcherView.tsx`, ensuring TanStack Query automatically deduplicates requests with **zero extra network requests** on the main operations desk.
4. **Dismissed IDs Location & Partialize**:
   - Stored in `AlertSlice` in memory (`dismissedAlertIds: string[]`) to keep the alert lifecycle cohesive and prevent repetitive sirens during the user's active session.
   - Explicitly **excluded** from `localStorage` in the persist `partialize` configuration so historical dismissals do not persist permanently across different days or users.
5. **Persist `migrate` Typing Corrected**:
   - Defined `PersistedPreferences = Pick<PreferencesSlice, "isSidebarCollapsed" | "isEmergencySoundMuted" | "tableDensity">`.
   - Typed `migrate` to receive and return `PersistedPreferences` rather than `PreferencesSlice` or `BoundState`, accurately reflecting serialized JSON data without action functions.
6. **Testing Checklist Expanded**: Added test cases for alert watcher polling, RBAC role-gating, prevention of re-alerting for dismissed IDs, and guaranteed visual banner rendering when sound is muted.

---

## 1. Current-State Findings (Codebase Scan)

### 1.1 Zustand Installation & Existing Stores
- **Installation status**: Zustand **v5.0.16** is installed in [`package.json`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/package.json#L33) (`"zustand": "^5.0.16"`), alongside React 19 (`^19.3.0`) and Next.js 16 (`16.3.6`).
- **Existing Store Files**:
  - [`src/store/types.ts`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/store/types.ts#L1-L10): Defines `BoundState = UISlice` and `SliceCreator<T> = StateCreator<BoundState, [], [], T>`.
  - [`src/store/slices/createUISlice.ts`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/store/slices/createUISlice.ts#L1-L17): Implements `isMobileDrawerOpen`, `setMobileDrawerOpen`, and `toggleMobileDrawer`.
  - [`src/store/useAppStore.ts`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/store/useAppStore.ts#L1-L26): Configures `useAppStore` with `devtools` middleware and exports atomic selector hooks (`useIsMobileDrawerOpen`, `useSetMobileDrawerOpen`, `useToggleMobileDrawer`).
  - **Store Consumers**: Currently consumed in [`src/components/layout/DashboardShell.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/DashboardShell.tsx#L8-L17) (lines 8–10, 16–17) to manage mobile drawer visibility. No persistence middleware is configured.

---

### 1.2 Layout & Preferences State
| State Item | Current Implementation & Location | Proposed Scope |
|---|---|---|
| `isSidebarCollapsed` | **Not implemented**. Sidebar has a fixed CSS width `w-60` in [`src/components/layout/Sidebar.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/Sidebar.tsx#L386) and hardcoded `lg:pl-60` in [`src/components/layout/DashboardShell.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/DashboardShell.tsx#L65). | Add to preferences slice; **persisted** to `localStorage`. |
| `isEmergencySoundMuted` | **Not implemented**. No audio alert state or controls exist in [`src/components/layout/Topbar.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/Topbar.tsx). | Add to preferences slice; **persisted** to `localStorage`. |
| `tableDensity` (`compact` \| `comfortable`) | **Not implemented**. Table padding is hardcoded (`TableCell` in [`src/components/ui/table.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/ui/table.tsx#L80-L91) has `p-2`; views use `py-3` / `py-4`). | Add to preferences slice; **persisted** to `localStorage`. |
| `isMobileDrawerOpen` | Implemented in [`src/store/slices/createUISlice.ts`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/store/slices/createUISlice.ts#L4-L8) and consumed in [`src/components/layout/DashboardShell.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/DashboardShell.tsx#L16-L17). | Kept in UI slice; **NOT persisted** (excluded via `partialize`). |

---

### 1.3 Real-Time Mechanisms & Alert Scan
- **Codebase Scan for Real-Time Infrastructure**:
  - Searched across all `.ts` and `.tsx` files for `WebSocket`, `socket.io`, `EventSource`, `refetchInterval`, and `polling`.
  - **Results**:
    - **No WebSockets exist** in the frontend codebase.
    - **No Server-Sent Events (SSE / EventSource) exist**.
    - **All real-time functionality is driven by TanStack Query HTTP short-polling via `refetchInterval`**:
      - [`DispatcherView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/dispatcher/_components/DispatcherView.tsx#L57): `useGetEmergencies({ limit: 100 }, { refetchInterval: 10_000 })` polls every 10 seconds.
      - [`DispatcherView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/dispatcher/_components/DispatcherView.tsx#L66): `useGetAmbulances(undefined, { refetchInterval: 10_000 })` polls every 10 seconds.
      - [`DispatcherDispatchView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/dispatcher/_components/DispatcherDispatchView.tsx#L67): `useGetDispatches(..., { refetchInterval: 10_000 })` polls every 10 seconds.
      - [`DriverView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/driver/_components/DriverView.tsx#L62): `refetchInterval: isOnShift ? 5000 : false` polls every 5 seconds.
      - [`HospitalStaffView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/hospital-staff/_components/HospitalStaffView.tsx#L78): `refetchInterval: 5000` polls every 5 seconds.
      - [`PatientView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/patient/_components/PatientView.tsx#L119): `useGetEmergencies({ limit: 50 }, { refetchInterval: 10_000 })` polls every 10 seconds.
      - [`Sidebar.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/Sidebar.tsx#L63): `useGetEmergencies({ limit: 10 }, { enabled: isPatient, refetchInterval: 10_000 })` polls every 10 seconds.
- **What will call `setActiveAlertId`**:
  - Handled by an **Alert Coordinator Hook (`useEmergencyAlertWatcher`)** mounted in [`DashboardShell.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/DashboardShell.tsx).
  - Gated strictly to roles: `DISPATCHER`, `ADMIN`, and `SUPER_ADMIN`.
  - Reuses query key `["emergencies", { limit: 100 }]`. When polling returns a new emergency where `priority === EmergencyPriority.P1_CRITICAL` and `status === EmergencyStatus.PENDING` whose ID is not in `dismissedAlertIds`, it calls `setActiveAlertId(emergency.id)`.

---

### 1.4 Dispatcher Map Selection Status
- **Current State**: [`DispatcherDispatchView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/dispatcher/_components/DispatcherDispatchView.tsx#L56-L85) manages dispatch table filters and dialog states locally via `useState`. No mapping library is installed (`leaflet`, `mapbox-gl` are absent), and no map component exists.
- **Decision**: **Deferred until a map component is added to the codebase.**

---

### 1.5 Conditional Scope Evaluations
1. **Global Modal Store** (`TripDetailDialog`, `RerouteHospitalDialog`, `CancelEmergencyDialog`):
   - `TripDetailDialog`: Opened from 5 distinct view files ([`DispatcherDispatchView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/dispatcher/_components/DispatcherDispatchView.tsx#L469), [`DispatcherView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/dispatcher/_components/DispatcherView.tsx#L946), [`DriverTripsView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/driver/_components/DriverTripsView.tsx#L320), [`DriverView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/driver/_components/DriverView.tsx#L1011), [`HospitalStaffView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/hospital-staff/_components/HospitalStaffView.tsx#L943)). In each case, state is local to that view.
   - `RerouteHospitalDialog`: Opened from [`DispatcherDispatchView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/dispatcher/_components/DispatcherDispatchView.tsx#L462), [`DispatcherView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/dispatcher/_components/DispatcherView.tsx#L937), and inside [`TripDetailDialog.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/shared/TripDetailDialog.tsx#L442). All use local `useState`.
   - `CancelEmergencyDialog`: Opened from [`EmergenciesListView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/admin/_components/EmergenciesListView.tsx#L347) and [`DispatcherView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/dispatcher/_components/DispatcherView.tsx#L517). Both use local `useState`.
   - **Verdict**: **DO NOT PLAN GLOBAL MODAL STORE**. Trigger buttons and dialogs coexist in the same component tree.
2. **Table Row Selection** (`UserManagementView`, `AmbulanceFleetView`):
   - [`UserManagementView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/shared/UserManagementView.tsx#L158-L266) & [`AmbulanceFleetView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/admin/_components/AmbulanceFleetView.tsx#L189-L280): Operates strictly on individual row action buttons. No checkboxes or bulk-action bars exist.
   - **Verdict**: **DO NOT PLAN TABLE ROW SELECTION STORE**.
3. **Emergency Wizard Draft** (`CreateEmergencyForm.tsx`):
   - [`CreateEmergencyForm.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/forms/CreateEmergencyForm.tsx#L38-L52): A single-step form modal mounted in [`PatientView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/patient/_components/PatientView.tsx#L856-L873).
   - **Verdict**: **DO NOT PLAN DRAFT STORE**. A single form instance is completely sufficient.

---

### 1.6 Audit of Misplaced State
- **Server Data**: Managed via TanStack Query v5 (`useGetMe`, `useGetEmergencies`, `useGetAmbulances`). No server data is in Zustand.
- **Table Filters/Search/Pagination**: Kept in local `useState` in views.
- **Form State**: Managed via local React state or TanStack Form in auth forms.
- **Session**: Managed via HTTP-only cookies and TanStack Query (`useGetMe`).
- **Identified Anti-Pattern**: In [`Sidebar.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/Sidebar.tsx#L86-L104) and [`PatientView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/patient/_components/PatientView.tsx#L165-L186), `hasActiveEmergency` is synchronized via `window.CustomEvent`. It should be derived directly from TanStack Query's cache (`useGetEmergencies`).

---

## 2. Proposed Stores Architecture

```
src/store/
  ├── types.ts                      # BoundState union & PersistedPreferences type
  ├── useAppStore.ts                # Combined store with devtools & persist
  └── slices/
      ├── createUISlice.ts          # Existing: mobile drawer (in-memory)
      ├── createPreferencesSlice.ts # New: sidebar, sound mute, table density (persisted)
      └── createAlertSlice.ts       # New: active alert ID, dismissed IDs & audio state (in-memory)
```

---

### Store Slice 1: Preferences Slice (Part of `useAppStore`)
- **File Path**: `src/store/slices/createPreferencesSlice.ts`
- **Purpose**: Persists user layout and display preferences across reloads.
- **State Shape**:
  ```ts
  export type TableDensity = "compact" | "comfortable";

  export interface PreferencesSlice {
    isSidebarCollapsed: boolean;
    isEmergencySoundMuted: boolean;
    tableDensity: TableDensity;
    setSidebarCollapsed: (collapsed: boolean) => void;
    toggleSidebarCollapsed: () => void;
    setEmergencySoundMuted: (muted: boolean) => void;
    toggleEmergencySoundMuted: () => void;
    setTableDensity: (density: TableDensity) => void;
  }
  ```
- **Persisted Shape Type**:
  ```ts
  export type PersistedPreferences = Pick<
    PreferencesSlice,
    "isSidebarCollapsed" | "isEmergencySoundMuted" | "tableDensity"
  >;
  ```
- **Middleware**: `persist` with key `name: "lifedispatch-preferences"`, wrapped inside `devtools`.
  - **`version: 1`**: Enables versioned schema evolution.
  - **`migrate`**: Typed strictly to `PersistedPreferences` (not the full slice or store):
    ```ts
    migrate: (persistedState: unknown, version: number): PersistedPreferences => {
      // Version 1 passthrough; future migrations transform older persisted shapes here
      return persistedState as PersistedPreferences;
    }
    ```
  - **`partialize`**: Strictly serializes only the 3 preference fields:
    ```ts
    partialize: (state): PersistedPreferences => ({
      isSidebarCollapsed: state.isSidebarCollapsed,
      isEmergencySoundMuted: state.isEmergencySoundMuted,
      tableDensity: state.tableDensity,
    })
    ```
  - **`skipHydration: true`**: Required to prevent Next.js SSR hydration mismatches.
- **Selector Pattern**:
  ```ts
  export const useIsSidebarCollapsed = () => useAppStore((s) => s.isSidebarCollapsed);
  export const useToggleSidebarCollapsed = () => useAppStore((s) => s.toggleSidebarCollapsed);
  export const useIsEmergencySoundMuted = () => useAppStore((s) => s.isEmergencySoundMuted);
  export const useToggleEmergencySoundMuted = () => useAppStore((s) => s.toggleEmergencySoundMuted);
  export const useTableDensity = () => useAppStore((s) => s.tableDensity);
  export const useSetTableDensity = () => useAppStore((s) => s.setTableDensity);
  ```

---

### Store Slice 2: Alert Slice (Part of `useAppStore`)
- **File Path**: `src/store/slices/createAlertSlice.ts`
- **Purpose**: Tracks dismissed emergency incident IDs and audio status without duplicating server data or holding active alert IDs.
- **State Shape**:
  ```ts
  export interface AlertSlice {
    dismissedAlertIds: string[]; // In-memory session dismissal list
    audioPlaying: boolean; // Reactive UI mirror of real <audio> element state
    audioBlocked: boolean; // Justification: required to track if audio.play() rejected under browser autoplay policy so UI can trigger unlock
    setAudioPlaying: (playing: boolean) => void;
    setAudioBlocked: (blocked: boolean) => void;
    dismissAlert: (id: string) => void;
    dismissAllAlerts: (ids: string[]) => void;
    pruneDismissedAlerts: (activeIds: string[]) => void;
  }
  ```
- **Derivation & TanStack Query Boundary**:
  - **`activeAlertId` is completely eliminated from Zustand**.
  - Components derive `activeEmergency` and `pendingCount` dynamically at render time from TanStack Query cache via `useDerivedEmergencyAlert()`.
  - When the user acknowledges an active alert, `dismissAlert(id)` or `dismissAllAlerts(ids)` appends the IDs to `dismissedAlertIds` in memory and silences the siren.
  - `dismissedAlertIds` is **explicitly excluded** from `localStorage` in the persist `partialize` configuration.
- **Selector Pattern**:
  ```ts
  export const useDismissedAlertIds = () => useAppStore((s) => s.dismissedAlertIds);
  export const useAudioPlaying = () => useAppStore((s) => s.audioPlaying);
  export const useAudioBlocked = () => useAppStore((s) => s.audioBlocked);
  export const useDismissAlert = () => useAppStore((s) => s.dismissAlert);
  export const useDismissAllAlerts = () => useAppStore((s) => s.dismissAllAlerts);
  export const usePruneDismissedAlerts = () => useAppStore((s) => s.pruneDismissedAlerts);
  ```

---

## 3. Next.js App Router Guide Analysis & Deviation Assessment

### 3.1 What the Official Zustand Next.js Guide Recommends
The official Zustand Next.js guide ([https://zustand.docs.pmnd.rs/guides/nextjs](https://zustand.docs.pmnd.rs/guides/nextjs)) states:
1. **No Global Singleton Stores**: A standard module-level store created with `create()` is a global variable. In SSR, this module is retained in Node.js server memory across incoming HTTP requests, creating a risk of cross-request state pollution if request-specific data is stored.
2. **Vanilla Store Factory + React Context**: Recommends creating stores per-request using `createStore` from `zustand/vanilla`, passing that store via a React `Context.Provider` created in a client component, and consuming it with `useStore(context, selector)`.
3. **Props Initialization**: Enables Server Components (RSCs) to fetch data and inject it into the store via the provider's `initialProps`.

### 3.2 Architectural Decision: Keeping the Global Client Store
We maintain the module-level store (`useAppStore = create(...)`) instead of wrapping the entire application tree in a Zustand React Context Provider.

### 3.3 Explicit Deviation from Docs: Reasoning & Risk
- **Reasoning**:
  1. **Strictly Client-Only State**: Contains **zero server-fetched data, zero auth tokens, and zero user profile data**. It manages only client UI preferences and transient alert flags.
  2. **No Server Component Access**: The store is neither imported nor initialized in Server Components. It is read and mutated strictly within Client Components (`"use client"`).
  3. **No Per-Request Props Seeding**: Preferences are read directly from the user's browser `localStorage` on the client, never from server request headers or database queries.
  4. **Existing Codebase Convention**: Preserves the established pattern in [`src/store/useAppStore.ts`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/store/useAppStore.ts#L6-L16).
- **Identified Risks**:
  1. **Future State Contamination Risk**: If a future developer mistakenly puts server data or user-specific records into `useAppStore`, that data could leak across concurrent SSR requests on the server.
     - *Mitigation*: Enforce a strict architectural rule in `AGENTS.md` prohibiting any server entities, session tokens, or API responses from entering Zustand.
  2. **Hydration Divergence Risk**: Global stores reading from `localStorage` synchronously during initial render cause hydration errors.
     - *Mitigation*: Enforce `skipHydration: true` and execute rehydration exactly once in `DashboardShell.tsx` after client mount.

---

## 4. Concrete Hydration & Layout-Flash Prevention Technique

### 4.1 The Mechanism & Citations
- **Official Zustand Persist Documentation** ([https://zustand.docs.pmnd.rs/integrations/persisting-store-data#skiphydration](https://zustand.docs.pmnd.rs/integrations/persisting-store-data#skiphydration)):
  Specifies `skipHydration: true` so the store does not automatically read from storage on module initialization, preventing server/client initial disagreement.
- **Official Next.js Hydration Documentation** ([https://nextjs.org/docs/messages/react-hydration-error](https://nextjs.org/docs/messages/react-hydration-error)):
  Specifies that client-only state differing from server HTML must be deferred until after the client component has mounted, using `useEffect`.

### 4.2 Concrete Implementation Pattern: Single-Point Rehydration & Read-Only Selector
1. **Single-Point Rehydration (Executed in `DashboardShell.tsx` only)**:
   In [`DashboardShell.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/DashboardShell.tsx), call `rehydrate()` **exactly once** on mount:
   ```tsx
   // In src/components/layout/DashboardShell.tsx
   useEffect(() => {
     useAppStore.persist.rehydrate();
   }, []);
   ```
2. **Read-Only Hydration Selector Hook (`useHasHydrated`)**:
   Other components never trigger rehydration. They only observe whether hydration has finished using `onFinishHydration`:
   ```ts
   // src/hooks/useHasHydrated.ts
   "use client";
   import { useEffect, useState } from "react";
   import { useAppStore } from "@/store/useAppStore";

   export function useHasHydrated(): boolean {
     const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());

     useEffect(() => {
       const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
       setHydrated(useAppStore.persist.hasHydrated());
       return () => unsub();
     }, []);

     return hydrated;
   }
   ```
3. **Transition Suppression in Layout**:
   In [`Sidebar.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/Sidebar.tsx) and [`DashboardShell.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/DashboardShell.tsx):
   - Read `const hasHydrated = useHasHydrated();` and `const isCollapsed = useIsSidebarCollapsed();`.
   - Before hydration completes (`hasHydrated === false`), render the default server width (`w-60` / `lg:pl-60`) with `transition-none`.
   - After hydration completes (`hasHydrated === true`), apply the stored state (`isCollapsed ? "w-16" : "w-60"`) and attach `transition-all duration-200`.
   - Result: Zero React hydration mismatch errors, zero cross-request contamination, and zero animated layout jumping during initial page load.

---

## 5. Migration Steps (Reordered for Independent Typechecking & Shippability)

Each step typechecks cleanly on its own and can be committed and shipped independently.

### Step 1: Create Preferences Slice
- **File**: `src/store/slices/createPreferencesSlice.ts`
- **Actions**:
  - Define `TableDensity = "compact" | "comfortable"`.
  - Define `PreferencesSlice` interface and `PersistedPreferences` type.
  - Implement standalone `createPreferencesSlice: StateCreator<PreferencesSlice, [["zustand/devtools", never], ["zustand/persist", unknown]], [], PreferencesSlice>`.
- **Verification**: `npx tsc --noEmit` succeeds independently.

### Step 2: Create Alert Slice
- **File**: `src/store/slices/createAlertSlice.ts`
- **Actions**:
  - Define `AlertSlice` interface (`activeAlertId`, `dismissedAlertIds`, `audioPlaying`, `audioBlocked`, and actions).
  - Implement standalone `createAlertSlice: StateCreator<AlertSlice, [["zustand/devtools", never]], [], AlertSlice>`.
  - Implement `dismissAlert: (id?: string) => void` to append the target ID to `dismissedAlertIds` and clear `activeAlertId`.
- **Verification**: `npx tsc --noEmit` succeeds independently.

### Step 3: Update Store Types
- **File**: [`src/store/types.ts`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/store/types.ts)
- **Actions**:
  - Import `PreferencesSlice` and `PersistedPreferences` from `./slices/createPreferencesSlice`.
  - Import `AlertSlice` from `./slices/createAlertSlice`.
  - Update union: `export type BoundState = UISlice & PreferencesSlice & AlertSlice;`.
  - Re-export `PersistedPreferences`.
- **Verification**: `npx tsc --noEmit` succeeds.

### Step 4: Configure `useAppStore.ts` with Persist & Selectors
- **File**: [`src/store/useAppStore.ts`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/store/useAppStore.ts)
- **Actions**:
  - Import `createPreferencesSlice` and `createAlertSlice`.
  - Configure `persist` middleware with:
    - `name: "lifedispatch-preferences"`
    - `version: 1`
    - `skipHydration: true`
    - `partialize: (state): PersistedPreferences => ({ isSidebarCollapsed: state.isSidebarCollapsed, isEmergencySoundMuted: state.isEmergencySoundMuted, tableDensity: state.tableDensity })`
    - `migrate: (persistedState: unknown, version: number): PersistedPreferences => persistedState as PersistedPreferences`
  - Export atomic hooks for preferences and alerts.
- **Verification**: `npx tsc --noEmit` succeeds; existing consumers remain unbroken.

### Step 5: Implement `useHasHydrated` Hook & Mount `rehydrate()` in Shell
- **Files**:
  - Create `src/hooks/useHasHydrated.ts` (lightweight read-only observer).
  - Modify [`src/components/layout/DashboardShell.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/DashboardShell.tsx) to execute `useAppStore.persist.rehydrate()` inside an initial `useEffect`.
- **Verification**: Store hydrates from `localStorage` exactly once across the entire application tree.

### Step 6: Implement Pure Derivation Hook
- **File**: Create `src/hooks/useDerivedEmergencyAlert.ts`.
- **Actions**:
  - Gated to `UserRole.DISPATCHER`, `UserRole.ADMIN`, `UserRole.SUPER_ADMIN` via `useGetMe()`.
  - Reuses query key `["emergencies", { limit: 100 }]`.
  - Derives `activeEmergency` (oldest unacknowledged P1), `pendingCount`, `allPendingP1`, and action wrappers (`dismissActive`, `dismissAll`).
  - Contains zero side effects (pure read-only derivation).
- **Verification**: Standalone hook compiles cleanly with `npx tsc --noEmit`.

### Step 7: Implement Emergency Audio Hook & Autoplay-Unlock Flow
- **File**: Create `src/hooks/useEmergencyAudio.ts`.
- **Actions**:
  - Calls `useDerivedEmergencyAlert()`.
  - Contains the single pruning effect that runs on query update to remove orphaned IDs from `dismissedAlertIds`.
  - Manages real `<audio>` element (`audioPlaying` in Zustand serves as a reactive UI mirror).
  - Implements siren behavior: loops until acknowledged; seeds existing P1s on first load/reload without siren; triggers siren only on brand-new unseen P1; stops on acknowledge/dismiss; does not re-sound retroactively on unmute.
  - Handles browser autoplay policy: catches `NotAllowedError`, sets `audioBlocked: true`, and registers a one-time document unlock listener.
- **Verification**: Standalone hook compiles cleanly.

### Step 8: Implement Emergency Alert Banner Component
- **File**: Create `src/components/layout/EmergencyAlertBanner.tsx`.
- **Actions**:
  - Consumes `useDerivedEmergencyAlert()`, `useAudioBlocked()`, and `useIsEmergencySoundMuted()`.
  - Renders prominently when `activeEmergency !== null`.
  - Shows "+N more critical pending" when `pendingCount > 1`.
  - Provides "Acknowledge" button calling `dismissActive()` and "Acknowledge all" button calling `dismissAll()`.
  - Shows audio unlock prompt when `audioBlocked === true`.
  - **Mute visual guarantee**: Banner renders prominently regardless of whether sound is muted.
- **Verification**: Compiles as an isolated component.

### Step 9: Wire Layout Components to Preferences Store
- **Targets**:
  - [`Sidebar.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/Sidebar.tsx): Apply `w-16` vs `w-60` based on `useIsSidebarCollapsed()` and `useHasHydrated()`.
  - [`DashboardShell.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/DashboardShell.tsx): Adjust padding `lg:pl-16` vs `lg:pl-60`. Mount `useEmergencyAudio()` and `EmergencyAlertBanner`.
  - [`Topbar.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/Topbar.tsx): Add collapse button calling `toggleSidebarCollapsed()` and sound button calling `toggleEmergencySoundMuted()`.
- **Verification**: Navigation remains functional across roles; preferences persist across reload.

### Step 10: Wire Table Density to DataTable
- **Target**: [`src/components/common/DataTable.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/common/DataTable.tsx)
- **Actions**:
  - Read `useTableDensity()`. Apply compact (`py-1.5 px-2 text-xs`) vs comfortable (`py-3 px-3 text-sm`) class to rendered table containers.
- **Verification**: Tables toggle density cleanly.

### Step 11: Run Linter & Formatter
- Execute `npm run check` (Biome) once across the codebase.

---

## 6. Testing & Verification Checklist

- [ ] **Typecheck Verification**: Each individual step passes `npx tsc --noEmit` without requiring subsequent steps.
- [ ] **Single Rehydration Call**: Verify in DevTools/console that `useAppStore.persist.rehydrate()` is called exactly once when `DashboardShell` mounts, and never repeatedly triggered by child components.
- [ ] **SSR & Hydration**:
  - Load page with `isSidebarCollapsed: true` in `localStorage`.
  - Verify console outputs zero React hydration warnings (error #418 / #423).
  - Verify sidebar does not execute an animated jump during initial mount.
- [ ] **Persistence Whitelist & Migrate Typing**:
  - Inspect `localStorage.getItem("lifedispatch-preferences")`.
  - Verify it contains strictly `isSidebarCollapsed`, `isEmergencySoundMuted`, and `tableDensity`.
  - Verify `isMobileDrawerOpen`, `dismissedAlertIds`, `audioPlaying`, and `audioBlocked` are **absent**.
- [ ] **Real-Time Render Derivation**:
  - Verify `activeEmergency` and `pendingCount` compute dynamically from TanStack Query without storing any entity or ID in Zustand.
- [ ] **Role Gating for Alerts**:
  - Log in as `DISPATCHER`, `ADMIN`, or `SUPER_ADMIN`: verify alerts and audio are active.
  - Log in as `PATIENT`, `DRIVER`, or `HOSPITAL_STAFF`: verify no alert polling, banner, or siren runs.
- [ ] **First-Load / Page Reload with Pre-Existing P1**:
  - Load or reload dashboard with existing P1 emergencies already in the backend.
  - Verify `EmergencyAlertBanner` renders immediately with incident details, but the siren stays **completely silent** (initial seeding runs after `isSuccess`).
- [ ] **Batch Arrival (Three New P1s in One Poll)**:
  - When 3 new P1 emergencies arrive together in a single polling cycle, verify all 3 are marked seen in one pass and the siren starts **exactly once** for the batch.
- [ ] **Siren Stop on Acknowledge One of Three (Queue Non-Persistence)**:
  - When siren is sounding for 3 pending emergencies, click "Acknowledge" on the active one.
  - Verify the siren **stops immediately** and does not continue blaring for the remaining 2 already-seen incidents in the queue.
- [ ] **Background Tab Polling & Siren Trigger**:
  - Dispatcher switches to another browser tab or minimizes the window.
  - When a new P1 emergency arrives on the backend, verify TanStack Query refetches in the background (`refetchIntervalInBackground: true`), the hook detects the new P1, and the siren audio triggers.
- [ ] **Acknowledge Click While Autoplay Is Blocked**:
  - When an alert arrives and autoplay is blocked (`audioBlocked: true`), clicking "Acknowledge" (or "Acknowledge all") on elements with `data-alert-ack` dismisses the emergency, starts **no audio**, and logs **no error** (unlock handler returns early on `[data-alert-ack]`, and any `AbortError` is handled silently).
- [ ] **New P1 Arrival While Siren Already Playing (No Restart/Stutter)**:
  - While the siren is actively looping for an ongoing P1 emergency, a second P1 emergency arrives.
  - Verify that the hook marks the second P1 as seen, but does **NOT** restart or interrupt the currently playing audio (`audio.paused` check preserves smooth, uninterrupted looping).
- [ ] **Acknowledge All Action**:
  - Click "Acknowledge all": verify all pending P1 IDs are added to `dismissedAlertIds`, the banner disappears, and the siren remains silent.
- [ ] **Stale Banner Auto-Dismissal (Cross-Dispatcher Sync)**:
  - When another dispatcher assigns the emergency in the backend, verify that on the next 10s poll cycle the emergency disappears from `pendingP1` and the banner dismisses or advances with zero manual user action.
- [ ] **Mute Then Unmute with Pending P1**:
  - Receive a P1 while sound is muted: verify emergency is marked seen immediately.
  - Unmute sound while the emergency is still pending: verify the siren does **NOT** retroactively start blaring for the already-seen emergency.
- [ ] **Autoplay Audio Policy & Fallback**:
  - Trigger a new P1 without prior document interaction.
  - Verify `audio.play()` rejection is caught, `audioBlocked` becomes `true`, and the alert banner prompts the user to enable audio.
  - Click anywhere on the page: verify audio context unlocks, siren starts, and `audioBlocked` resets to `false`.
- [ ] **Automatic Dismissed ID & Seen ID Pruning**:
  - After an emergency transitions out of the query list, verify its ID is automatically pruned from both `dismissedAlertIds` and internal `seenIdsRef` so memory does not leak over long-running sessions. When the emergencies list is empty, verify all dismissed IDs are cleared.

---

## 7. Sources List (Fetched & Verified URLs)

Every source below was directly queried, fetched, and reviewed during research:

1. **Zustand Official Next.js Guide (Per-Request Store & React Context Pattern)**:
   - **URL**: [https://zustand.docs.pmnd.rs/guides/nextjs](https://zustand.docs.pmnd.rs/guides/nextjs)
   - **Content**: Recommends creating per-request stores with `createStore` from `zustand/vanilla` wrapped in React Context to prevent cross-request state leakage when storing server/request data. Explains that RSCs cannot access Zustand.
2. **Zustand Official Persist Middleware Documentation (`skipHydration`, `version`, `migrate`)**:
   - **URL**: [https://zustand.docs.pmnd.rs/integrations/persisting-store-data#skiphydration](https://zustand.docs.pmnd.rs/integrations/persisting-store-data#skiphydration)
   - **Content**: Documents `skipHydration: true` to prevent automatic hydration during SSR, `partialize` to whitelist persisted keys, `version`, and `migrate` for versioned migrations.
3. **Next.js Official Documentation on React Hydration Error & Client Mount Patterns**:
   - **URL**: [https://nextjs.org/docs/messages/react-hydration-error](https://nextjs.org/docs/messages/react-hydration-error)
   - **Content**: Outlines the standard two-phase mount pattern using `useEffect` on the client to avoid mismatch errors between server-rendered HTML and client browser storage.
4. **Next.js App Router Client Components Documentation**:
   - **URL**: [https://nextjs.org/docs/app/building-your-application/rendering/client-components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
   - **Content**: Confirms Client Components (`"use client"`) are prerendered on the server during initial load and hydrated on the client; browser APIs (`window`, `localStorage`) must run inside effects.
5. **TkDodo (Dominik Dorfmeister): "React Query as a State Manager"**:
   - **URL**: [https://tkdodo.eu/blog/react-query-as-a-state-manager](https://tkdodo.eu/blog/react-query-as-a-state-manager)
   - **Content**: Argues that asynchronous server data belongs in the query cache, and global state managers should not duplicate server data.
6. **TkDodo (Dominik Dorfmeister): "Deriving Client State from Server State"**:
   - **URL**: [https://tkdodo.eu/blog/deriving-client-state-from-server-state](https://tkdodo.eu/blog/deriving-client-state-from-server-state)
   - **Content**: Demonstrates that client state stores should store only user intent (e.g. `selectedId` or `activeAlertId`), and components should compute/derive full objects by looking up the ID in TanStack Query's cache.
7. **Zustand Official Slices Pattern & TypeScript**:
   - **URL**: [https://zustand.docs.pmnd.rs/guides/slices-pattern](https://zustand.docs.pmnd.rs/guides/slices-pattern) & [https://zustand.docs.pmnd.rs/guides/typescript](https://zustand.docs.pmnd.rs/guides/typescript)
   - **Content**: Documents how to type independent slices using `StateCreator` with middleware mutators.
8. **Zustand Official Shallow Equality (`useShallow`)**:
   - **URL**: [https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-use-shallow](https://zustand.docs.pmnd.rs/guides/prevent-rerenders-with-use-shallow)
   - **Content**: Documents `useShallow` from `zustand/react/shallow` to prevent unnecessary component re-renders when selecting derived objects.
9. **Chrome Autoplay Policy Best Practices**:
   - **URL**: [https://developer.chrome.com/blog/autoplay/](https://developer.chrome.com/blog/autoplay/)
   - **Content**: Unmuted audio playback without user interaction fails with `NotAllowedError`. Outlines handling rejected play promises and resuming audio on user gesture.

---

## 8. Open Questions

1. **Real-Time Alert Source (Latency vs Push)**:
   - No WebSockets or Server-Sent Events (SSE) exist in the codebase; real-time updates rely entirely on TanStack Query HTTP polling (`refetchInterval: 10_000`). Is a **10-second polling latency** acceptable for triggering P1 critical emergency alerts, or should a WebSocket/SSE push transport be prioritized on the backend for instant siren activation?
2. **Sidebar Collapsed Visual Specification**:
   - In collapsed mode (`isSidebarCollapsed === true`), should the sidebar collapse to an icon-only dock (`w-16`) or hide entirely with an off-canvas drawer? *(Plan assumes an icon-only dock of `w-16` on desktop).*
3. **Audio Asset Location**:
   - Audio path is hardcoded to `/sounds/emergency-siren.mp3`.
   - **NOTE (Action Required by User)**: The file `public/sounds/emergency-siren.mp3` does not currently exist in the repository and must be supplied by the user. The audio hook contains a safe error listener that catches 404/decode failures gracefully without throwing unhandled exceptions.
4. **Window Event Bus Cleanup**:
   - [`Sidebar.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/components/layout/Sidebar.tsx#L86-L104) and [`PatientView.tsx`](file:///d:/level-2/lifedispatch/lifedispatch-frontend/src/app/dashboard/patient/_components/PatientView.tsx#L165-L186) currently use `window.CustomEvent` for `lifedispatch:emergency-status` and `lifedispatch:open-request-modal`. Should cleaning up this custom event bus in favor of TanStack Query cache derivation and a unified UI trigger be included when wiring the layout stores?

---

## 9. Scope Justifications & Suggestions (Not in Scope)

### 9.1 Justifications for Elements Supporting In-Scope Requirements
- **`audioBlocked: boolean` (in AlertSlice)**:
  - *Justification*: Required to track whether `audio.play()` was blocked under the browser autoplay policy so the UI knows when to prompt for an unlock gesture.
- **`dismissedAlertIds: string[]` (in AlertSlice)**:
  - *Justification*: Required to prevent acknowledged P1 emergencies from repeatedly triggering sirens on every subsequent 10-second polling cycle.
- **Topbar Buttons (Sidebar Collapse & Sound Mute)**:
  - *Justification*: Required user-interaction entry points to toggle `isSidebarCollapsed` and `isEmergencySoundMuted`.

### 9.2 Suggestions (Not in Scope)
- **Tooltip Hover for Collapsed Sidebar Icons**: Add accessible tooltips showing navigation labels when hovering collapsed sidebar icons. *(Reason: Prevents navigation ambiguity when icon labels are hidden).*
- **Web Audio API Synthesizer Fallback**: Implement emergency sirens using a lightweight Web Audio API oscillator (`sawtooth` wave with frequency sweep) in addition to an `.mp3` file. *(Reason: Prevents network loading failures or 404s when audio files fail to load under unstable connectivity).*
- **Replace `window.CustomEvent` with TanStack Query Cache**: Derive `hasActiveEmergency` in `Sidebar.tsx` directly from the cached query data of `useGetEmergencies({ limit: 10 })`. *(Reason: Eliminates DOM event listeners and avoids desynchronization between components).*
- **TanStack Form Conversion for CreateEmergencyForm**: Migrate `CreateEmergencyForm.tsx` from raw React `useState` to TanStack Form + Zod once form validation rules are unified. *(Reason: Aligns `CreateEmergencyForm` with `LoginForm` and `RegisterForm` architecture as defined in project rules).*
