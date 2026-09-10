# Complete Technical Audit & Implementation Review: RUET Health Complex Frontend

---

## 1. Project Overview

* **Project Name**: `ruet-medical-frontend` (RUET Health Complex)
* **Purpose & Objective**: A dedicated healthcare management application for the **Rajshahi University of Engineering & Technology (RUET) Health Complex**. Its objective is to provide on-campus medical services, appointment scheduling, medical record keeping, prescription writing, medical certificate issuance, laboratory test tracking, test billing, and medicine dispensing for students, teachers, officers, and staff.
* **Type of Application**: Single-Page Application (SPA) Web Application built with React.
* **Current Development Stage**: **Advanced Interactive Prototype / Mock-Driven Proof of Concept (PoC)**. The core doctor, student, receptionist, and pathologist workflows are modeled and interactive using client-side persistent state (`localStorage`), while the admin modules, user registration, teacher/officer dashboards, and actual backend APIs are missing or stubbed.
* **Main Technologies & Frameworks**:
  * **Framework**: React 19.2.5 (`react`, `react-dom`)
  * **Build Tool**: Vite 8.0.10 (`@vitejs/plugin-react` 6.0.1)
  * **Language**: TypeScript 6.0.2 (`typescript`, `typescript-eslint`)
  * **Styling**: Tailwind CSS 3.4.13, PostCSS 8.5.12, Autoprefixer 10.5.0
  * **Icons**: Lucide React 1.12.0
* **Major Libraries & Dependencies**:
  * `zustand` (v5.0.12) with `persist` middleware for state management.
  * `react-router-dom` (v7.14.2) for client-side routing.
  * `jspdf` (v4.2.1) and `html2canvas` (v1.4.1) for client-side PDF document generation and printing.
  * `clsx` (v2.1.1) for dynamic class name merging.
  * `uuid` (v14.0.0) for unique ID generation.
* **Project Architecture**: Client-side layered architecture consisting of:
  * Route Layer (`App.tsx` using `HashRouter`)
  * Layout Shells (`PublicLayout`, `MainLayout`, `AdminLayout`, `DoctorLayout`, `PathologistLayout`)
  * Feature Modules (`src/features/` divided by domain: admin, doctor, home, pathologist, receptionist, services, staff, student, tests)
  * Route Pages (`src/pages/` for login, full-screen prescription, and certificate views)
  * State Store Layer (`src/store/` with 6 persisted Zustand stores)
  * Seed/Mock Data Layer (`src/data/` for users, patients, medicines, and tests)
* **Frontend / Backend / Database Status**:
  * **Frontend**: Highly structured, functional UI layer with client-side reactive state.
  * **Backend**: **Non-existent**. There is no backend server (Node.js, Express, Django, etc.).
  * **Database**: **Non-existent**. No SQL or NoSQL database is attached. Data lives entirely in browser `localStorage` and static TypeScript arrays.
  * **API Layer**: **Non-existent**. The `services/` directory referenced in the project README does not exist in the actual source code.
* **State Management Solution**: Zustand stores using the `persist` middleware, serializing state slices into browser `localStorage`.
* **Routing Solution**: React Router 7 (`HashRouter`) using hash-based URLs (e.g., `/#/doctor`, `/#/student`).
* **Authentication & Authorization Approach**: Client-side pseudo-authentication. Users select a role from a dropdown and enter an ID matching [users.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/users.ts). There are **no passwords**, no session tokens, no JWTs, and no cryptographic verification. Route guards exist in some layouts (`DoctorLayout`, `PathologistLayout`), but are missing from `AdminLayout`, `/student`, and `/receptionist/*`.
* **UI/Component Architecture**: Atomic/modular component structure, with a minimal base UI set ([Button.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/components/ui/Button.tsx), [Card.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/components/ui/Card.tsx), [Input.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/components/ui/Input.tsx), [Badge.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/components/ui/Badge.tsx)) and domain-specific feature components.

---

## 2. Project Structure

### Root Directory Overview
* [package.json](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/package.json): Defines npm scripts (`dev`, `build`, `lint`, `preview`) and dependencies.
* [vite.config.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/vite.config.ts): Basic Vite configuration using `@vitejs/plugin-react`.
* [tailwind.config.js](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/tailwind.config.js): Tailwind content config pointing to `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`.
* [eslint.config.js](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/eslint.config.js): ESLint 10 flat configuration with TypeScript and React rules.
* [index.html](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/index.html): SPA HTML entry point mounting `src/main.tsx` into `#root`.
* [README.md](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/README.md): Project documentation explaining setup, architecture, and technology stack.

### Source Directory (`src/`) Breakdown

```text
src/
├── assets/                  # Static media (hero.png, vite.svg, react.svg)
├── components/              # Shared UI components
│   ├── ui/                  # Reusable UI primitives (Button, Card, Input, Badge)
│   ├── Navbar.tsx           # Global role-aware navigation bar
│   ├── Footer.tsx           # Dead code: unused standalone footer
│   └── ScrollToTop.tsx      # Window scroll reset on route change
├── config/                  # Configuration parameters
│   └── siteSettings.ts      # University working hours, emergency contacts, ambulance numbers
├── data/                    # Mock / Seed datasets
│   ├── medicines.ts         # Static medicine inventory (4 items)
│   ├── mockPatients.ts      # Static student patient records (2 items)
│   ├── tests.ts             # Static test catalog (32 diagnostic tests with prices)
│   └── users.ts             # Demo users across roles (doctor, student, admin, etc.)
├── features/                # Domain-specific feature modules
│   ├── admin/               # Admin dashboard, sidebar (dead), doctor & medicine pages
│   ├── doctor/              # Doctor dashboard, appointments, consultancy panels, public doctor view
│   ├── home/                # Public landing page with hero & service overview
│   ├── pathologist/         # Lab dashboard, test management, test detail entry, report view, profile
│   ├── receptionist/        # Patient table, test billing/invoicing, pharmacy medicine dispensing
│   ├── services/            # Public medical services list with timings & prerequisites
│   ├── staff/               # Public medical technologist & nursing staff directory
│   ├── student/             # Student dashboard, profile, appointment booking/list, certificates, reports
│   └── tests/               # Public diagnostic test price list
├── layouts/                 # Structural shell components
│   ├── AdminLayout.tsx      # Admin header tabs and Outlet wrapper (unprotected)
│   ├── DoctorLayout.tsx     # Doctor layout with role check guard and sub-navigation tabs
│   ├── MainLayout.tsx       # Standard shell with Navbar, main padding, and print-hidden footer
│   ├── PathologistLayout.tsx# Pathologist layout with role check guard and Outlet (no tabs)
│   └── PublicLayout.tsx     # Shell for public-facing pages (duplicate of MainLayout)
├── pages/                   # Standalone page views
│   ├── LoginPage.tsx        # Role selection and ID input authentication page
│   ├── PrescriptionPage.tsx # Doctor prescription creation interface
│   ├── ViewPrescriptionPage.tsx # Printable prescription layout with watermark
│   ├── CreateCertificatePage.tsx # Medical certificate issuance form
│   └── ViewCertificatePage.tsx # Printable medical certificate layout
├── store/                   # Zustand state stores with localStorage persistence
│   ├── useAppointmentStore.ts # Appointment CRUD and serial generation
│   ├── useAuthStore.ts        # Active user session
│   ├── useBillingStore.ts     # Invoicing and test billing
│   ├── useCertificateStore.ts # Medical certificate issuance and retrieval
│   ├── useLaboratoryStore.ts  # Lab requests, parameter entry, validation, reporting
│   └── usePrescriptionStore.ts # Prescriptions, medication lists, status updates
├── types/                   # TypeScript interfaces
│   ├── appointment.ts       # Appointment and AppointmentStatus types
│   └── laboratory.ts        # LabRequest, LabReport, TestParameter, ResultFlag types
├── App.css                  # Dead code: unused default Vite starter CSS
├── App.tsx                  # Root routing configuration (HashRouter)
├── index.css                # Tailwind directives and custom webkit date/time styling
└── main.tsx                 # React DOM root render with StrictMode
```

---

## 3. Feature Inventory

| Feature | Status | Location | Description & Implementation Reality |
| :--- | :--- | :--- | :--- |
| **Public Landing Page** | ✅ Implemented | [HomePage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/home/HomePage.tsx) | Hero section, emergency ambulance call box, service overview cards, and quick portal links. Functional and styled. |
| **Public Doctor Directory** | ✅ Implemented | [PublicDoctorsPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/PublicDoctorsPage.tsx) | Displays 2 doctors with designations, phone numbers, and email links from a local array. |
| **Public Staff Directory** | ✅ Implemented | [PublicStaffPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/staff/PublicStaffPage.tsx) | Displays 7 medical staff members (nurses, technologists, MLSS) with designations and phone numbers. |
| **Public Services Directory** | ✅ Implemented | [PublicServicesPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/services/PublicServicesPage.tsx) | Detailed breakdown of 7 medical complex services including schedules, required documents, and pricing rules. |
| **Public Diagnostic Test Directory** | ✅ Implemented | [PublicTestsPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/tests/PublicTestsPage.tsx) | Lists 32 tests grouped by category (Pathology, ECG, Ultrasonography) with student and employee price tiers. |
| **Authentication / Login** | 🟡 Partial / ⚠️ Demo | [LoginPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/LoginPage.tsx) | Matches ID against [users.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/users.ts). **No password field**, no token, no session expiry. Helper text suggests invalid ID `RUET001`. Teacher/officer roles trigger an alert. |
| **Role-Based Routing** | 🟡 Partial | [App.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/App.tsx) | Doctor and Pathologist routes have layout-level redirect guards. Admin, Student, and Receptionist routes have **no guards**. Direct URLs like `/#/prescription/1` are completely unprotected. |
| **Student Dashboard** | ✅ Implemented | [StudentDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/StudentDashboard.tsx) | Aggregates student profile, appointments list, medical history timeline, lab reports, and certificates. |
| **Student Profile Display** | ✅ Implemented | [StudentProfile.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/StudentProfile.tsx) | Displays blood group, age, contact, guardian info from [mockPatients.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/mockPatients.ts). |
| **Appointment Booking** | ✅ Implemented | [BookAppointmentModal.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/BookAppointmentModal.tsx) | Validates Friday closures, prevents past dates, selects doctor from `users.ts`, auto-generates serial number (`APT-YYYYMMDD-XXX`), saves to Zustand store. |
| **Student Appointment Management** | ✅ Implemented | [AppointmentsList.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/AppointmentsList.tsx) | Lists active appointments with status badges, individual deletion, and "Clear All" with confirmation. |
| **Student Medical History** | ✅ Implemented | [MedicalHistory.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/MedicalHistory.tsx) | Displays timeline of prescriptions written for the logged-in student, sorted newest first, with links to view prescriptions. |
| **Student Lab Reports** | ✅ Implemented | [LaboratoryReports.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/LaboratoryReports.tsx) | Displays only `Validated` laboratory reports for the student with external links to the full report view. |
| **Student Medical Certificates** | ✅ Implemented | [MedicalCertificates.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/MedicalCertificates.tsx) | Displays issued sick leave certificates with date ranges and links to printable views. |
| **Doctor Overview** | ✅ Implemented | [DoctorOverview.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/DoctorOverview.tsx) | Aggregates unique patient counts, pending request counts, prescriptions written count, and upcoming appointment table. |
| **Doctor Appointment Review** | ✅ Implemented | [AppointmentsPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/AppointmentsPage.tsx) | Tabbed filter (Pending, Accepted, Rejected, All). Doctors can click "Accept" or "Reject", updating the appointment store. |
| **Doctor Consultancy** | 🟡 Partial | [ConsultancyPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/ConsultancyPage.tsx) | Search by patient ID. Displays patient details and recent lab reports. However, treatment history is hardcoded mock data. Suffers from a lint/TDZ error on direct query param load. |
| **Doctor Prescription Creation** | ✅ Implemented | [PrescriptionPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/PrescriptionPage.tsx) | Problem description, medicine autocomplete search with stock check, dosage/duration entry, diagnostic test selection, advice field. Saves prescription and automatically dispatches lab requests. |
| **Prescription Viewing / Printing** | ✅ Implemented | [ViewPrescriptionPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/ViewPrescriptionPage.tsx) | High-fidelity medical prescription layout with RUET crest watermark, clinical diagnosis, Rx section, advice, doctor signature block, print-specific CSS, and PDF download via html2canvas/jsPDF. |
| **Medical Certificate Issuance** | ✅ Implemented | [CreateCertificatePage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/CreateCertificatePage.tsx) | Diagnosis input, start/end dates with inclusive day duration calculation, remarks field. Persists to `useCertificateStore`. |
| **Medical Certificate Viewing** | ✅ Implemented | [ViewCertificatePage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/ViewCertificatePage.tsx) | Formal institutional certificate layout with reference number (`MC-UUID`), watermark, and PDF generation. |
| **Receptionist Patient Management** | 🟡 Partial / ⚠️ Mock | [PatientManagement.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/receptionist/PatientManagement.tsx) | Table with search filter over [mockPatients.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/mockPatients.ts). "Register New Patient", "Filter Options", "View Profile", and "Edit Patient" buttons have **no event handlers**. Gender is hardcoded to `/ M`. |
| **Receptionist Test Billing** | ✅ Implemented | [TestBilling.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/receptionist/TestBilling.tsx) | Patient ID lookup, Student vs Employee tier toggling, multi-test selector, discount/tax calculations, invoice generation (`INV-XXXX`), PDF export, and automatic request forwarding to laboratory queue. |
| **Receptionist Pharmacy Dispense** | ✅ Implemented | [MedicineDispense.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/receptionist/MedicineDispense.tsx) | Pending vs Dispensed prescription tabs, full prescription preview, "Mark as Dispensed" status updater, and "Auto-Generate Test Bill" link prefilling billing state. |
| **Pathologist Dashboard** | ✅ Implemented | [PathologistDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/PathologistDashboard.tsx) | Stat cards for Pending, In Progress, Awaiting Review, and Completed Today. Quick links to process tests and review reports. |
| **Pathologist Test Queue & Filtering** | ✅ Implemented | [TestManagement.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/TestManagement.tsx) | Dual-mode view (`/pathologist/tests` and `/pathologist/reports`), search by patient/test, filter by status (`Pending`, `In Progress`, `Awaiting Validation`, `Validated`, `Rejected`). |
| **Pathologist Test Processing** | ✅ Implemented | [TestDetails.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/TestDetails.tsx) | Auto-transitions request to `In Progress`. Pre-populates parameters for CBC or Blood Sugar, allows dynamic parameter addition/removal, flag selection (normal/high/low/critical), and submits report for validation. |
| **Pathologist Report Validation** | ✅ Implemented | [ReportView.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/ReportView.tsx) | Printable lab report. When viewed by a pathologist on `Awaiting Validation` status, shows a functional "Validate Report" button that sets status to `Validated` and timestamps validation. |
| **Pathologist Profile** | 🟡 Partial | [PathologistProfile.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/PathologistProfile.tsx) | Read-only profile view. "Edit Profile" button has no handler. |
| **Admin Dashboard** | 🟡 Partial / ⚠️ Mock | [AdminDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/AdminDashboard.tsx) | Doctor count, medicine count, low stock count. Doctor remove triggers a fake alert. Medicine stock updates only update local component state and are lost on reload. |
| **Admin Doctor Management** | ❌ Missing / Stub | [DoctorsPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/doctors/DoctorsPage.tsx) | Contains [AddDoctorForm.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/doctors/AddDoctorForm.tsx) which only calls `console.log`, and [DoctorList.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/doctors/DoctorList.tsx) which statically displays "No doctors yet". |
| **Admin Medicine Management** | ❌ Missing / Stub | [MedicinesPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/medicines/MedicinesPage.tsx) | Contains [AddMedicineForm.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/medicines/AddMedicineForm.tsx) which only calls `console.log`, and [MedicineList.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/medicines/MedicineList.tsx) which statically displays "No medicines yet". |
| **Teacher Dashboard** | ❌ Missing | None | Role exists in `users.ts` and login dropdown, but triggers alert: "teacher dashboard not implemented yet". |
| **Officer Dashboard** | ❌ Missing | None | Role exists in `users.ts` and login dropdown, but triggers alert: "officer dashboard not implemented yet". |
| **User Registration / Sign Up** | ❌ Missing | None | No public or receptionist form exists to create new student, doctor, or staff accounts. |
| **Password Reset / Recovery** | ❌ Missing | None | No password or credential recovery mechanism exists. |

---

## 4. User Roles & Permissions

### System Roles Identified
The system defines 7 roles in [users.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/users.ts): `doctor`, `student`, `teacher`, `officer`, `admin`, `receptionist`, `pathologist`.

```typescript
// From src/data/users.ts
export type UserRole = "doctor" | "student" | "teacher" | "officer" | "admin" | "receptionist" | "pathologist";
```

### Detailed Role Profiles

#### 1. Student
* **Dashboard**: `/student` rendered by [StudentDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/StudentDashboard.tsx).
* **Accessible Pages**: `/student`, `/doctors`, `/staff`, `/tests`, `/services`, `/#/prescription/view/:id`, `/#/certificate/view/:id`, `/#/reports/view/:id`.
* **Available Actions**: Book appointments (with Friday validation), view personal appointments, delete appointments, view medical prescription history, view validated lab reports, view and download medical leave certificates.
* **Restrictions**: Cannot accept/reject appointments, cannot write prescriptions, cannot validate tests, cannot issue bills.
* **Enforcement Status**: **Unenforced on route level**. `/student` has no route guard in [App.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/App.tsx). An unauthenticated user navigating to `/#/student` will simply see a blank dashboard with `user?.name` undefined.

#### 2. Doctor
* **Dashboard**: `/doctor` rendered by [DoctorDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/DoctorDashboard.tsx) within [DoctorLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/DoctorLayout.tsx).
* **Accessible Pages**: `/doctor`, `/doctor/appointments`, `/doctor/consultancy`, `/prescription/:id`, `/certificate/create/:patientId`, plus public pages.
* **Available Actions**: View metrics, filter appointment requests, accept/reject appointments, search patient by university ID, view patient profile and lab reports, write prescriptions with stock checking, order diagnostic tests, issue medical leave certificates with automatic duration calculations.
* **Enforcement Status**: **Enforced on layout level**. [DoctorLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/DoctorLayout.tsx) redirects to `/login` if `!user || user.role !== "doctor"`. However, `/prescription/:id` and `/certificate/create/:patientId` are declared outside `DoctorLayout` in [App.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/App.tsx) and have **no protection**.

#### 3. Receptionist
* **Dashboard**: `/receptionist` redirects to `/receptionist/patients`. Sub-routes: `/receptionist/patients`, `/receptionist/billing`, `/receptionist/pharmacy`.
* **Accessible Pages**: Patient Management, Test Billing, Pharmacy Dispense.
* **Available Actions**: Search patient table, generate test bills with student/employee rates, calculate tax/discounts, dispatch tests to the laboratory queue, view prescription queue, mark prescribed medicines as dispensed, trigger auto-billing for tests ordered in prescriptions.
* **Enforcement Status**: **Unenforced**. Routes are rendered directly in [App.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/App.tsx) with no layout guard.

#### 4. Pathologist
* **Dashboard**: `/pathologist/dashboard` within [PathologistLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/PathologistLayout.tsx).
* **Accessible Pages**: `/pathologist/dashboard`, `/pathologist/tests`, `/pathologist/tests/:id`, `/pathologist/reports`, `/pathologist/profile`, `/reports/view/:id`.
* **Available Actions**: View pending lab tests, process a test request, record test parameters (values, units, ranges, abnormal flags), submit reports for validation, formally validate reports (`Awaiting Validation` → `Validated`), print and export PDF reports.
* **Enforcement Status**: **Enforced on layout level**. [PathologistLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/PathologistLayout.tsx) redirects to `/login` if `!user || user.role !== "pathologist"`. However, `/reports/view/:id` is declared at the root level outside the layout.

#### 5. Admin
* **Dashboard**: `/admin` within [AdminLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/AdminLayout.tsx). Sub-routes: `/admin/medicines`, `/admin/doctors`.
* **Accessible Pages**: Admin Dashboard, Admin Medicines, Admin Doctors.
* **Available Actions**: View doctor and medicine counts, update local medicine stock in dashboard (unpersisted). Doctor addition and medicine addition pages are non-functional stubs.
* **Enforcement Status**: **Completely Unenforced**. [AdminLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/AdminLayout.tsx) does not check `useAuthStore`. Any user or guest navigating to `/#/admin` has full access.

#### 6. Teacher & Officer
* **Status**: **Unimplemented**. Although present in the login dropdown and in [users.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/users.ts) (`TCH001`, `OFF001`), [LoginPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/LoginPage.tsx) executes:
  ```typescript
  alert(`${user.role} dashboard not implemented yet`);
  ```

### Role-Permission Matrix

| Resource / Capability | Student | Doctor | Receptionist | Pathologist | Admin | Public / Guest |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| View Public Info (Doctors, Tests, Staff) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Book Appointments | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Accept / Reject Appointments | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Student Medical History | ✅ (Self) | ✅ (Lookup) | ❌ | ❌ | ❌ | ❌ |
| Create Prescription | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Dispense Medicines | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Create Test Bill / Invoice | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Enter Test Parameter Results | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Validate Laboratory Report | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Issue Medical Certificate | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Access Admin Panels | ❌ | ❌ | ❌ | ❌ | 🟡 (Stubs) | ⚠️ (Unprotected) |

### Security & Authorization Limitations
1. **Frontend-Only Pseudo-Security**: All authorization checks happen inside React components and layouts via `useAuthStore`.
2. **Hardcoded User List**: User credentials consist only of an ID string hardcoded in [users.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/users.ts).
3. **Missing Route Guards**: Half of the sensitive routes (`/student`, `/receptionist/*`, `/admin/*`, `/prescription/:id`, `/certificate/create/:patientId`) have **zero route guards**.
4. **URL Manipulation Vulnerability**: Anyone can type `/#/prescription/2204001` or `/#/certificate/create/2204001` into the browser and submit prescriptions or certificates under whatever name is in localStorage or fallback text.

---

## 5. Page-by-Page Audit

### 1. Landing Page (`/`)
* **Route**: `/`
* **Layout**: [PublicLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/PublicLayout.tsx)
* **Components**: [HomePage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/home/HomePage.tsx), [Navbar.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/components/Navbar.tsx), inlined footer.
* **Roles**: All / Public.
* **Data Displayed**: Hero banner, 24/7 ambulance emergency numbers (`01715204378`, `01712637265`), service cards (Specialist Doctors, Medical Staffs, Diagnostic Tests).
* **Actions**: Links to `/login`, `/doctors`, `/staff`, `/tests`, `/services`.
* **State / Mock Data**: Uses [siteSettings.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/config/siteSettings.ts).
* **Loading / Empty / Error States**: None (static render).
* **Responsive Behavior**: Responsive flex/grid (`md:grid-cols-2`, `md:grid-cols-3`).
* **Feature Completeness**: Complete for landing page requirements.

### 2. Login Page (`/login`)
* **Route**: `/login`
* **Layout**: [PublicLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/PublicLayout.tsx)
* **Components**: [LoginPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/LoginPage.tsx), `Card`, `Input`, `Button`.
* **Roles**: Public.
* **Data Displayed**: Medical center service timings, ambulance contacts, role selector dropdown, ID input field.
* **Actions**: Select role, enter University ID, click Login.
* **State / Mock Data**: [users.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/users.ts), [useAuthStore.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/store/useAuthStore.ts).
* **Validation**: Checks `!id.trim()`, validates `user.id === id && user.role === role`. Alerts if invalid.
* **Bugs / Inconsistencies**: Helper text suggests demo ID `RUET001` which does not exist in `users.ts` (student IDs are `2204001` and `2204002`). Selecting student and typing `RUET001` yields an error.
* **Feature Completeness**: 🟡 Partial (no password, no token, alerts used for errors).

### 3. Student Dashboard (`/student`)
* **Route**: `/student`
* **Layout**: [MainLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/MainLayout.tsx)
* **Components**: [StudentDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/StudentDashboard.tsx), [StudentProfile.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/StudentProfile.tsx), [AppointmentsList.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/AppointmentsList.tsx), [BookAppointmentModal.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/BookAppointmentModal.tsx), [MedicalHistory.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/MedicalHistory.tsx), [LaboratoryReports.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/LaboratoryReports.tsx), [MedicalCertificates.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/MedicalCertificates.tsx).
* **Roles**: Student (intended), but route is unprotected.
* **Data Displayed**: Student personal & guardian information, operating hours, appointments with status & serial, prescription history timeline, validated lab reports, medical leave certificates.
* **Actions**: Open booking modal, submit appointment request, delete appointment, clear all appointments, navigate to view prescription, certificate, or lab report.
* **State / Mock Data**: [mockPatients.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/mockPatients.ts), `useAuthStore`, `useAppointmentStore`, `usePrescriptionStore`, `useLaboratoryStore`, `useCertificateStore`.
* **Loading / Empty States**: Proper empty states with dashed borders and icons for all lists.
* **Feature Completeness**: ✅ Complete client-side implementation.

### 4. Doctor Dashboard & Overview (`/doctor`)
* **Route**: `/doctor`
* **Layout**: [DoctorLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/DoctorLayout.tsx)
* **Components**: [DoctorDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/DoctorDashboard.tsx), [DoctorOverview.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/DoctorOverview.tsx).
* **Roles**: Doctor only (protected by `DoctorLayout`).
* **Data Displayed**: Total unique patients, pending appointment requests count, total prescriptions written, upcoming accepted appointments table.
* **Actions**: Click "Consult" on an upcoming appointment to route to `/doctor/consultancy?patientId=:id`.
* **State / Mock Data**: `useAppointmentStore`, `usePrescriptionStore`, `useAuthStore`.
* **Loading / Empty States**: Empty table placeholder when no appointments exist.
* **Feature Completeness**: ✅ Complete.

### 5. Doctor Appointments Management (`/doctor/appointments`)
* **Route**: `/doctor/appointments`
* **Layout**: [DoctorLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/DoctorLayout.tsx)
* **Components**: [AppointmentsPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/AppointmentsPage.tsx).
* **Roles**: Doctor.
* **Data Displayed**: Appointments filtered by tabs (`pending`, `accepted`, `rejected`, `all`), patient name, university ID, serial number, date, time, reported symptoms.
* **Actions**: Click "Accept" or "Reject" on pending appointments.
* **State / Mock Data**: `useAppointmentStore`.
* **Loading / Empty States**: Empty state card for empty categories.
* **Feature Completeness**: ✅ Complete.

### 6. Doctor Consultancy Page (`/doctor/consultancy`)
* **Route**: `/doctor/consultancy`
* **Layout**: [DoctorLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/DoctorLayout.tsx)
* **Components**: [ConsultancyPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/ConsultancyPage.tsx), [DoctorHeader.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/DoctorHeader.tsx), [PatientDetails.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/PatientDetails.tsx), [TreatmentHistory.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/TreatmentHistory.tsx), [RightPanel.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/RightPanel.tsx).
* **Roles**: Doctor.
* **Data Displayed**: Patient ID search input, patient summary card, treatment history, emergency contacts, validated lab reports for patient.
* **Actions**: Search patient by ID; click "Create Prescription" (navigates to `/prescription/:id`); click "Create Certificate" (navigates to `/certificate/create/:patientId`); click "View" on lab reports.
* **Known Bug**: `handleSearch` is invoked in `useEffect` before declaration, causing ESLint failure and potential TDZ error when navigated with `?patientId=`.
* **State / Mock Data**: [mockPatients.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/mockPatients.ts), `useLaboratoryStore`. [TreatmentHistory.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/TreatmentHistory.tsx) has hardcoded flu/headache mock data.
* **Feature Completeness**: 🟡 Partial (mock treatment history, TDZ bug).

### 7. Prescription Creation Page (`/prescription/:id`)
* **Route**: `/prescription/:id`
* **Layout**: [MainLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/MainLayout.tsx)
* **Components**: [PrescriptionPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/PrescriptionPage.tsx).
* **Roles**: Intended for Doctor, but **completely unprotected**.
* **Data Displayed**: Left side: form (problem, medicine autocomplete, dosage, days, test search, advice); Right side: live preview of formatted prescription.
* **Actions**: Autocomplete medicine search from `medicines.ts` with stock check; add/edit/remove medicines; autocomplete diagnostic test search from `tests.ts`; submit prescription; print; export PDF.
* **State / Mock Data**: `usePrescriptionStore`, `useLaboratoryStore`, `medicines.ts`, `tests.ts`, `mockPatients.ts`.
* **Side Effects**: On submit, adds prescription to `usePrescriptionStore` AND dispatches test orders to `useLaboratoryStore`.
* **Feature Completeness**: ✅ Complete client-side functionality.

### 8. View Prescription Page (`/prescription/view/:prescriptionId`)
* **Route**: `/prescription/view/:prescriptionId`
* **Layout**: [MainLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/MainLayout.tsx)
* **Components**: [ViewPrescriptionPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/ViewPrescriptionPage.tsx).
* **Roles**: All (Patient, Doctor, Pharmacist).
* **Data Displayed**: Institutional letterhead, watermark, student details, diagnosis, Rx section, prescribed medicines with dosages and days, advice, ordered tests, doctor signature.
* **Actions**: Print (`window.print()`), PDF download (`html2canvas` + `jspdf`), Go Back.
* **Feature Completeness**: ✅ Complete.

### 9. Create Medical Certificate Page (`/certificate/create/:patientId`)
* **Route**: `/certificate/create/:patientId`
* **Layout**: [MainLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/MainLayout.tsx)
* **Components**: [CreateCertificatePage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/CreateCertificatePage.tsx).
* **Roles**: Intended for Doctor, but **unprotected**.
* **Data Displayed**: Patient name and ID banner, diagnosis input, start date, end date, calculated rest duration, remarks textarea.
* **Actions**: Fill form, calculate duration automatically, submit certificate, redirect to `/doctor`.
* **State / Mock Data**: `useCertificateStore`, `mockPatients.ts`, `useAuthStore`.
* **Feature Completeness**: ✅ Complete.

### 10. View Medical Certificate Page (`/certificate/view/:certificateId`)
* **Route**: `/certificate/view/:certificateId`
* **Layout**: [MainLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/MainLayout.tsx)
* **Components**: [ViewCertificatePage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/ViewCertificatePage.tsx).
* **Roles**: All.
* **Data Displayed**: Official certificate format, Ref No (`MC-XXXXXXXX`), student name, diagnosis, recommended rest days, start/end dates, remarks, authorized doctor signature block.
* **Actions**: Print (`window.print()`), Download PDF (`html2canvas` + `jspdf`).
* **Feature Completeness**: ✅ Complete.

### 11. Receptionist Patient Management (`/receptionist/patients`)
* **Route**: `/receptionist/patients` (redirected from `/receptionist`)
* **Layout**: [MainLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/MainLayout.tsx)
* **Components**: [PatientManagement.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/receptionist/PatientManagement.tsx).
* **Roles**: Receptionist (unprotected).
* **Data Displayed**: Table of patients (ID, name, age/gender, blood group, contact, guardian contact).
* **Actions**: Search by name, ID, or phone. "Register New Patient", "Filter Options", "View Profile", and "Edit Patient" buttons have **no `onClick` handlers**.
* **State / Mock Data**: [mockPatients.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/mockPatients.ts).
* **Feature Completeness**: 🟡 Partial / UI Mock.

### 12. Receptionist Test Billing (`/receptionist/billing`)
* **Route**: `/receptionist/billing`
* **Layout**: [MainLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/MainLayout.tsx)
* **Components**: [TestBilling.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/receptionist/TestBilling.tsx).
* **Roles**: Receptionist (unprotected).
* **Data Displayed**: Patient ID lookup, patient info card, student vs employee pricing toggle, test selection dropdown, selected tests list, discount/tax inputs, payment method (Cash, Card, Mobile Banking), payment status (Paid, Due), live bill preview.
* **Actions**: Add/remove tests, generate invoice (`INV-XXXX`), auto-forward lab requests to `useLaboratoryStore`, print receipt, export receipt as PDF. Consumes `location.state` when linked from pharmacy.
* **State / Mock Data**: `useBillingStore`, `useLaboratoryStore`, `tests.ts`, `mockPatients.ts`.
* **Feature Completeness**: ✅ Complete client-side functionality.

### 13. Receptionist Pharmacy & Dispensing (`/receptionist/pharmacy`)
* **Route**: `/receptionist/pharmacy`
* **Layout**: [MainLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/MainLayout.tsx)
* **Components**: [MedicineDispense.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/receptionist/MedicineDispense.tsx).
* **Roles**: Receptionist (unprotected).
* **Data Displayed**: Left: tabs for Pending and Dispensed prescription queues; Right: full prescription preview.
* **Actions**: Select prescription, review medicines, click "Mark as Dispensed" (updates `usePrescriptionStore`), click "Auto-Generate Test Bill" (navigates to `/receptionist/billing` with test state).
* **State / Mock Data**: `usePrescriptionStore`, `mockPatients.ts`.
* **Feature Completeness**: ✅ Complete client-side functionality.

### 14. Pathologist Dashboard (`/pathologist/dashboard`)
* **Route**: `/pathologist/dashboard`
* **Layout**: [PathologistLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/PathologistLayout.tsx)
* **Components**: [PathologistDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/PathologistDashboard.tsx).
* **Roles**: Pathologist (protected by `PathologistLayout`).
* **Data Displayed**: Stats for Pending Tests, In Progress, Awaiting Review, Completed Today; lists of pending requests and reports awaiting validation.
* **Actions**: Links to process test (`/pathologist/tests/:id`) or review report (`/reports/view/:id`).
* **State / Mock Data**: `useLaboratoryStore`.
* **Feature Completeness**: ✅ Complete.

### 15. Pathologist Test Management & Reports (`/pathologist/tests` & `/pathologist/reports`)
* **Route**: `/pathologist/tests` and `/pathologist/reports` (rendered by same component)
* **Layout**: [PathologistLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/PathologistLayout.tsx)
* **Components**: [TestManagement.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/TestManagement.tsx).
* **Roles**: Pathologist.
* **Data Displayed**: Table of test requests or reports based on route path, status badges, date, patient ID/name.
* **Actions**: Search by patient/test, filter by status dropdown, click "Process Test" or "View / Validate".
* **State / Mock Data**: `useLaboratoryStore`.
* **Feature Completeness**: ✅ Complete.

### 16. Pathologist Test Processing (`/pathologist/tests/:id`)
* **Route**: `/pathologist/tests/:id`
* **Layout**: [PathologistLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/PathologistLayout.tsx)
* **Components**: [TestDetails.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/TestDetails.tsx).
* **Roles**: Pathologist.
* **Data Displayed**: Patient info, request info, dynamic parameter rows (Name, Value, Unit, Reference Range, Flag).
* **Actions**: Automatically sets request status to `In Progress`; edit parameter values; add/remove parameter rows; select flag (normal, high, low, critical, abnormal); enter remarks; enter interpretation; click "Submit for Validation" (creates report in `useLaboratoryStore` with status `Awaiting Validation`).
* **State / Mock Data**: `useLaboratoryStore`.
* **Feature Completeness**: ✅ Complete.

### 17. Laboratory Report View (`/reports/view/:id`)
* **Route**: `/reports/view/:id`
* **Layout**: Standalone page with top action bar.
* **Components**: [ReportView.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/ReportView.tsx).
* **Roles**: Pathologist, Doctor, Student, Public (unprotected).
* **Data Displayed**: Official RUET Laboratory Report header, patient information, parameter results table with color-coded flags, pathologist interpretation, remarks, signature blocks.
* **Actions**: If logged in as pathologist and status is `Awaiting Validation`, displays "Validate Report" button; Print; Download PDF.
* **State / Mock Data**: `useLaboratoryStore`, `useAuthStore`.
* **Feature Completeness**: ✅ Complete.

### 18. Pathologist Profile (`/pathologist/profile`)
* **Route**: `/pathologist/profile`
* **Layout**: [PathologistLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/PathologistLayout.tsx)
* **Components**: [PathologistProfile.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/PathologistProfile.tsx).
* **Roles**: Pathologist.
* **Data Displayed**: Cover banner, avatar, name, role, department, employee ID, email, office location.
* **Actions**: "Edit Profile" button (no handler).
* **Feature Completeness**: 🟡 Partial (read-only mock view).

### 19. Admin Dashboard (`/admin`)
* **Route**: `/admin`
* **Layout**: [AdminLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/AdminLayout.tsx)
* **Components**: [AdminDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/AdminDashboard.tsx).
* **Roles**: Admin (unprotected).
* **Data Displayed**: Total Doctors count, Total Medicines count, Low Stock count, Doctor search list with "Remove" buttons, Medicine stock list with numeric stock inputs.
* **Actions**: Search doctors; click "Remove" (triggers `alert("Remove doctor (future)")`); edit stock quantity (only modifies local component `useState`).
* **State / Mock Data**: Local component state initialized from `users.ts` and `medicines.ts`. **Not connected to any persistent store**.
* **Feature Completeness**: 🟡 Partial / Mock.

### 20. Admin Doctors Page (`/admin/doctors`)
* **Route**: `/admin/doctors`
* **Layout**: [AdminLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/AdminLayout.tsx)
* **Components**: [DoctorsPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/doctors/DoctorsPage.tsx), [AddDoctorForm.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/doctors/AddDoctorForm.tsx), [DoctorList.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/doctors/DoctorList.tsx).
* **Roles**: Admin (unprotected).
* **Data Displayed**: Form inputs (Name, ID) and static text "No doctors yet".
* **Actions**: "Add Doctor" button logs to `console.log` only.
* **Feature Completeness**: ❌ Missing / Pure Stub.

### 21. Admin Medicines Page (`/admin/medicines`)
* **Route**: `/admin/medicines`
* **Layout**: [AdminLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/AdminLayout.tsx)
* **Components**: [MedicinesPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/medicines/MedicinesPage.tsx), [AddMedicineForm.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/medicines/AddMedicineForm.tsx), [MedicineList.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/medicines/MedicineList.tsx).
* **Roles**: Admin (unprotected).
* **Data Displayed**: Form inputs (Name, Stock Quantity) and static text "No medicines yet".
* **Actions**: "Add Medicine" button logs to `console.log` only.
* **Feature Completeness**: ❌ Missing / Pure Stub.

---

## 6. Workflow Analysis

### Workflow 1: Student Appointment Booking & Consultation Cycle

```text
[Student]
  │  Login (ID: 2204001) -> /student
  │  Click "Book Appointment" -> BookAppointmentModal
  │  Select Doctor (DOC001), Date, Time, Symptoms
  │  (Validates !Friday, >= today)
  │  Submit -> useAppointmentStore.addAppointment
  │  Serial generated: APT-20260910-001, Status: 'pending'
  ▼
[Doctor]
  │  Login (ID: DOC001) -> /doctor
  │  DoctorOverview shows: Pending Requests = 1
  │  Navigate to /doctor/appointments
  │  Click "Accept" on appointment APT-20260910-001
  │  Status updated to 'accepted'
  ▼
[Student]
  │  Student /student refreshed
  │  AppointmentsList reflects green badge: "Accepted"
  ▼
[Doctor]
  │  DoctorOverview shows appointment in "Upcoming Appointments"
  │  Doctor clicks "Consult" -> /doctor/consultancy?patientId=2204001
  │  Patient info & past lab reports loaded
  │  Doctor clicks "Create Prescription" -> /prescription/2204001
```
* **State Changes**: `useAppointmentStore` (creates record, updates status from `pending` to `accepted`).
* **Integrity**: Fully verified and working seamlessly between Student and Doctor roles via `localStorage`.

---

### Workflow 2: Doctor Prescription, Lab Test Ordering & Pharmacy Dispense

```text
[Doctor]
  │  At /prescription/2204001
  │  Enters diagnosis problem: "Acute Pharyngitis"
  │  Searches medicine: "Azithromycin" (Stock: 20 verified)
  │  Enters dosage "1+0+0", 5 days -> Add Medicine
  │  Searches diagnostic test: "CBC" (T-005) -> Add Test
  │  Enters advice: "Warm saline gargle"
  │  Clicks "Submit"
  │  ├── usePrescriptionStore.addPrescription -> status: 'pending'
  │  └── useLaboratoryStore.addRequest -> status: 'Pending'
  ▼
[Student]
  │  At /student -> MedicalHistory
  │  Prescription appears immediately in timeline
  │  Student clicks "View & Download" -> /prescription/view/:id
  │  Renders official formatted prescription with RUET watermark & PDF export
  ▼
[Receptionist / Pharmacist]
  │  Login (ID: REC001) -> /receptionist/pharmacy
  │  MedicineDispense shows prescription in "Pending (1)" queue
  │  Pharmacist reviews Azithromycin dosage
  │  Pharmacist clicks "Auto-Generate Test Bill"
  │  ├── Navigates to /receptionist/billing with route state { patientId, tests: [CBC] }
  │  └── TestBilling automatically populates patient 2204001 and test CBC (৳50.00)
  │  Pharmacist returns and clicks "Mark as Dispensed"
  │  usePrescriptionStore.updatePrescriptionStatus -> 'dispensed'
  │  Prescription moves to "Dispensed" tab
```
* **State Changes**: `usePrescriptionStore` (adds prescription, updates status to `dispensed`), `useLaboratoryStore` (adds pending test request).
* **Integrity**: Verified. The cross-module prefill between `MedicineDispense` and `TestBilling` via `location.state` is fully functional.

---

### Workflow 3: Laboratory Testing, Validation & Report Delivery

```text
[Triggered by Doctor Prescription OR Receptionist Test Billing]
  │  useLaboratoryStore.addRequest -> Request REQ-XXXX ('Pending')
  ▼
[Pathologist]
  │  Login (ID: PATH001) -> /pathologist/dashboard
  │  Stats show "Pending Tests" incremented
  │  Navigates to /pathologist/tests
  │  Clicks "Process Test" -> /pathologist/tests/REQ-XXXX
  │  ├── useEffect automatically sets request status to 'In Progress'
  │  ├── Form displays pre-configured CBC parameters (Hemoglobin, WBC, Platelets)
  │  ├── Pathologist enters values (e.g. 14.2 g/dL, normal flag)
  │  ├── Pathologist enters remarks and interpretation
  │  └── Clicks "Submit for Validation"
  │      └── useLaboratoryStore.addReport -> Report REP-YYYY ('Awaiting Validation')
  ▼
[Pathologist Validation]
  │  Pathologist dashboard shows "Awaiting Review (1)"
  │  Pathologist opens /reports/view/REP-YYYY
  │  Since user is Pathologist and status is 'Awaiting Validation',
  │  green "Validate Report" button appears on top bar
  │  Pathologist clicks "Validate Report"
  │  useLaboratoryStore.validateReport -> status: 'Validated', validatedAt: Date.now()
  ▼
[Patient & Doctor Visibility]
  │  Student at /student -> LaboratoryReports displays CBC report (Validated)
  │  Doctor at /doctor/consultancy?patientId=2204001 -> RightPanel displays CBC report
  │  Both can open and print the finalized official lab report with PDF download
```
* **State Changes**: `useLaboratoryStore` (request status `Pending` → `In Progress`; report created with `Awaiting Validation`; validated report status `Validated`).
* **Integrity**: Verified. This is one of the most sophisticated end-to-end chains implemented in the project.

---

### Workflow 4: Medical Certificate Issuance & Student Download

```text
[Doctor]
  │  In Consultancy (/doctor/consultancy?patientId=2204001)
  │  Clicks "Create Certificate" -> /certificate/create/2204001
  │  Enters Diagnosis: "Infectious Mononucleosis"
  │  Selects Start Date: 2026-09-11, End Date: 2026-09-17
  │  Form automatically computes 7 days duration
  │  Enters Remarks: "Strict bed rest recommended"
  │  Submits -> useCertificateStore.addCertificate
  │  Redirects back to /doctor
  ▼
[Student]
  │  Visits /student -> MedicalCertificates
  │  Certificate appears with 7 Days Leave badge and validity range
  │  Student clicks "View & Download" -> /certificate/view/:certificateId
  │  Renders official RUET Medical Certificate with Ref No MC-XXXXXXXX
  │  Student prints or downloads PDF
```
* **State Changes**: `useCertificateStore` (generates certificate with `uuidv4` and persists in localStorage).
* **Integrity**: Verified and fully working.

---

### Broken or Missing Workflows

1. **Patient Registration Workflow**:
   * Receptionist clicks "Register New Patient" on `/receptionist/patients` → **Nothing happens** (no modal, no route, no handler).
2. **Admin Doctor & Medicine Management**:
   * Admin navigates to `/admin/doctors` or `/admin/medicines` → Fills form → Clicks "Add" → **Nothing is added to any store or list**; values are merely logged to the browser console.
3. **Teacher / Officer Consultation**:
   * Teacher or Officer logs in → **Blocked by browser alert** (`"teacher dashboard not implemented yet"`).

---

## 7. Data & State Management

### State Storage & Libraries
The project manages application state using **Zustand (v5.0.12)** with the `persist` middleware. All persisted state slices are stored in the browser's `window.localStorage` as JSON strings.

### Store Inventory

| Store File | Storage Key | Key Entities & Fields | Update Operations |
| :--- | :--- | :--- | :--- |
| [useAuthStore.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/store/useAuthStore.ts) | `auth-storage` | `user: { id, name, role } \| null` | `setUser(user)`, `logout()` |
| [useAppointmentStore.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/store/useAppointmentStore.ts) | `appointment-storage` | `appointments: Appointment[]` (`id`, `patientId`, `patientName`, `doctorId`, `doctorName`, `date`, `time`, `symptoms`, `status`, `serialNumber`, `createdAt`) | `addAppointment()`, `updateAppointmentStatus()`, `deleteAppointment()` |
| [usePrescriptionStore.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/store/usePrescriptionStore.ts) | `prescription-storage` | `prescriptions: Prescription[]` (`id`, `patientId`, `doctorId`, `doctorName`, `date`, `problem`, `medicines: [...]`, `tests: [...]`, `advice`, `status`) | `addPrescription()`, `updatePrescriptionStatus('dispensed')` |
| [useLaboratoryStore.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/store/useLaboratoryStore.ts) | `laboratory-storage` | `requests: LaboratoryRequest[]`, `reports: LaboratoryReport[]` | `addRequest()`, `updateRequestStatus()`, `addReport()`, `updateReport()`, `validateReport()` |
| [useBillingStore.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/store/useBillingStore.ts) | `billing-storage` | `bills: Bill[]` (`id`, `patientId`, `patientName`, `tests: [...]`, `subTotal`, `discount`, `tax`, `totalAmount`, `paymentMethod`, `status`, `date`) | `addBill()` |
| [useCertificateStore.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/store/useCertificateStore.ts) | `medical-certificates-storage` | `certificates: MedicalCertificate[]` (`id`, `patientId`, `patientName`, `doctorId`, `doctorName`, `date`, `diagnosis`, `restStartDate`, `restEndDate`, `recommendedRestDays`, `remarks`) | `addCertificate()` |

### Data Relationships (Client-Side)

```text
[User] (DOC001 / 2204001)
  ▲
  │ (patientId = universityId)
[mockPatients] ───────┬──────────────┬──────────────┬──────────────┐
                      │              │              │              │
                      ▼              ▼              ▼              ▼
                [Appointment]  [Prescription]  [Lab Request]   [Certificate]
                      │              │              │              │
                      │ (status:     │ (medicines,  │ (status:     │ (rest days,
                      │  accepted)   │  tests ordered) in-progress)│  dates)
                      ▼              ▼              ▼              │
                   [Doctor]    [MedicineDispense] [Lab Report]     │
                                     │              │              │
                                     ▼              ▼              ▼
                               [TestBilling]   [Validated     [Printable
                                (Invoice)       Report]       Certificate]
```

### Persistence & Cross-Role Data Sharing
* **Persistence**: Because all stores use Zustand `persist`, all appointment bookings, prescriptions, bills, certificates, and lab reports **survive page refreshes and browser restarts**.
* **Cross-Role Sharing**: Because all roles share the same browser `localStorage` domain, switching users via `/login` allows seamless testing of multi-actor workflows (e.g., student creates appointment → log out → doctor logs in → doctor accepts → doctor prescribes → log out → receptionist dispenses).
* **Limitations**:
  * Data is strictly local to the individual browser instance. Opening the site in Incognito or on another computer shows an empty database (except for initial seed requests in `useLaboratoryStore`).
  * `AdminDashboard` medicine stock updates are held only in React local state (`useState`) and **do not survive page refresh**.

---

## 8. Backend & Database Readiness

### Current Backend Status
* **Backend**: **0% Implemented**. No server runtime, no API endpoints, no backend framework.
* **Database**: **0% Implemented**. No schema migrations, no ORM, no connection strings.
* **Authentication Server**: **0% Implemented**. No sessions, no JWT issuing, no OAuth, no password hashing.
* **Server-Side Validation**: **0% Implemented**. All validation is strictly HTML5 attributes and client-side JavaScript alerts.

### Frontend → Backend Integration Blueprint

When a real backend is implemented, the current mock stores and direct state mutations must be replaced with REST or GraphQL API calls. The required integration endpoints are:

```text
1. Authentication & Session
   POST   /api/v1/auth/login             { id, password } -> { token, user: { id, name, role } }
   POST   /api/v1/auth/logout            { } -> 200 OK
   GET    /api/v1/auth/me                Bearer token -> { id, name, role, profile }

2. Patients Management
   GET    /api/v1/patients               ?search=&page=&limit= -> { patients: [...], total }
   GET    /api/v1/patients/:id           -> { patient, medicalHistory, guardian }
   POST   /api/v1/patients               { universityId, name, phone, age, bloodGroup, guardianName, guardianPhone }
   PUT    /api/v1/patients/:id           { ...updates }

3. Appointments
   GET    /api/v1/appointments          ?doctorId=&patientId=&status=&date= -> Appointment[]
   POST   /api/v1/appointments          { doctorId, date, time, symptoms } -> Appointment with serialNumber
   PATCH  /api/v1/appointments/:id/status { status: 'accepted' | 'rejected' } -> Appointment
   DELETE /api/v1/appointments/:id       -> 204 No Content

4. Prescriptions & Pharmacy
   GET    /api/v1/prescriptions          ?patientId=&status= -> Prescription[]
   GET    /api/v1/prescriptions/:id      -> Prescription
   POST   /api/v1/prescriptions          { patientId, problem, medicines: [{ medicineId, dosage, days }], tests: [testId], advice }
   PATCH  /api/v1/prescriptions/:id/dispense { status: 'dispensed' } -> 200 OK

5. Laboratory & Pathology
   GET    /api/v1/lab/requests           ?status=&patientId= -> LaboratoryRequest[]
   GET    /api/v1/lab/requests/:id       -> LaboratoryRequest
   PATCH  /api/v1/lab/requests/:id/status { status: 'In Progress' } -> LaboratoryRequest
   POST   /api/v1/lab/reports            { requestId, patientId, testName, parameters: [{ name, value, unit, referenceRange, flag }], remarks, interpretation }
   GET    /api/v1/lab/reports/:id        -> LaboratoryReport
   PATCH  /api/v1/lab/reports/:id/validate -> LaboratoryReport (status: 'Validated', validatedAt: ISO)

6. Medical Certificates
   GET    /api/v1/certificates          ?patientId= -> MedicalCertificate[]
   GET    /api/v1/certificates/:id      -> MedicalCertificate
   POST   /api/v1/certificates          { patientId, diagnosis, restStartDate, restEndDate, remarks } -> MedicalCertificate

7. Billing & Invoicing
   GET    /api/v1/billing/invoices       ?patientId= -> Bill[]
   POST   /api/v1/billing/invoices       { patientId, tests: [{ id, price }], discount, tax, paymentMethod, status } -> Bill

8. Inventory & System Administration
   GET    /api/v1/medicines              ?search= -> Medicine[] (with real stock counts)
   POST   /api/v1/medicines              { name, stock }
   PATCH  /api/v1/medicines/:id/stock    { stock }
   GET    /api/v1/doctors                -> Doctor[]
   POST   /api/v1/doctors                { name, id, specialization, phone, email }
```

---

## 9. UI/UX Audit

### Visual Consistency & Design Language
* **Design System**: Built on Tailwind CSS utility classes using a cohesive university healthcare palette: primary royal blue (`#2563eb`, `#1d4ed8`), navy (`#1e3a8a`), slate footer (`#0f172a`), emerald green for certificates/dispensing (`#059669`), and red for alerts/emergency contacts (`#dc2626`).
* **Typography**: Uses system sans-serif font stack. Hierarchy is clean with bold headers (`text-2xl`, `text-3xl font-extrabold`) and subtle muted subtitles (`text-gray-500`, `text-sm font-medium`).
* **Watermarks & Document Realism**: Printable prescriptions, certificates, and lab reports feature a background SVG watermark of the RUET emblem with low opacity (`opacity-[0.04]`), standard institutional letterheads, bilingual contact strings, and doctor signature blocks.

### Layout & Responsiveness
* **Desktop Layout**: Spacious multi-column layouts with sidebar/sub-navigation headers, responsive grid dashboards (`grid-cols-1 md:grid-cols-3` or `grid-cols-1 lg:grid-cols-12`).
* **Mobile / Tablet Responsiveness**:
  * [Navbar.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/components/Navbar.tsx) includes a fully functional mobile hamburger toggle with slide-down menu.
  * Tables in [AppointmentsList.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/AppointmentsList.tsx), [PublicTestsPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/tests/PublicTestsPage.tsx), and [TestManagement.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/pathologist/TestManagement.tsx) are wrapped in `overflow-x-auto` wrappers to prevent mobile horizontal blowouts.
* **Print Styling**: Dedicated `@media print` utilities (`print:hidden`, `print:p-0`, `print:border-none`, `print:shadow-none`) ensure clean single-page outputs when using the browser print dialog.

### Weaknesses & Usability Shortcomings
1. **Reliance on Browser `alert()` and `confirm()`**: Actions like appointment booking, billing, prescription submission, and validation trigger native browser modal dialogs (`alert()`, `window.confirm()`) instead of modern accessible toast notifications or custom confirmation modals.
2. **Missing Loading States**: There are no skeleton loaders or spinner states anywhere in the application. Because all data is synchronous in localStorage, components assume data is instantly available.
3. **Empty Admin Screens**: Admin routes display unstyled, plain white boxes with raw inputs and text like "No doctors yet", clashing with the high aesthetic polish of the student and doctor pages.
4. **Non-Functional Decorative Buttons**: Buttons like "Register New Patient" and "Edit Profile" look clickable and primary, but do nothing on click, causing user confusion.

---

## 10. Code Quality Audit

### Strengths
* **TypeScript Strictness**: `tsc -b` compiles cleanly with zero type errors. Interfaces are defined for appointments, lab tests, lab reports, patients, bills, certificates, and users.
* **Modularity**: Domain logic is grouped cleanly under `src/features/` by role/context.
* **PDF & Printing Implementation**: Clean integration of `html2canvas` and `jspdf` combined with `@media print` CSS.

### Code Issues Identified

```text
Issue 1: Variable accessed before declaration (Temporal Dead Zone / React Hook Lint Error)
Location: src/features/doctor/ConsultancyPage.tsx (Lines 17, 21)
Severity: High
Why it matters: ESLint fails the build. If ConsultancyPage mounts with a ?patientId= query parameter, handleSearch is executed inside useEffect before the const handleSearch arrow function has been initialized in lexical scope, risking runtime failure.
Recommended approach: Convert handleSearch into a hoisted function declaration or wrap it in useCallback placed above useEffect.
```

```text
Issue 2: Dead / Orphaned Code Files
Location: 
  - src/components/Footer.tsx
  - src/features/admin/AdminSidebar.tsx
  - src/features/doctor/NotesPanel.tsx
  - src/features/doctor/PrescriptionPanel.tsx
  - src/App.css
Severity: Medium
Why it matters: Unused code increases bundle size and confuses maintainers. Both MainLayout and PublicLayout duplicate the footer inline instead of reusing Footer.tsx.
Recommended approach: Refactor MainLayout/PublicLayout to import Footer.tsx, and delete AdminSidebar.tsx, NotesPanel.tsx, PrescriptionPanel.tsx, and App.css.
```

```text
Issue 3: Huge Production Chunk (>1 MB)
Location: dist/assets/index-D3xR-HBI.js (1,025.89 kB)
Severity: Medium
Why it matters: jsPDF and html2canvas are imported statically in several pages, forcing the entire library suite into the main bundle. Initial page load performance suffers.
Recommended approach: Use React lazy loading (React.lazy() / dynamic import()) for PrescriptionPage, ViewPrescriptionPage, TestBilling, and ReportView.
```

```text
Issue 4: Hardcoded Mock Data in Functional Component
Location: src/features/doctor/TreatmentHistory.tsx (Lines 11-14)
Severity: Medium
Why it matters: Regardless of which patient is loaded in ConsultancyPage, TreatmentHistory displays a hardcoded flu and headache from April 2026 rather than querying usePrescriptionStore.
Recommended approach: Connect TreatmentHistory to usePrescriptionStore.getPrescriptionsByPatient(patient.universityId).
```

```text
Issue 5: Malformed JSX Attribute Syntax
Location: src/features/admin/AdminDashboard.tsx (Line 119)
Severity: Low
Why it matters: aria-label={'Stock for ${m.name}'} uses single quotes instead of backticks, rendering literal text instead of interpolating the medicine name.
Recommended approach: Change to aria-label={`Stock for ${m.name}`}.
```

```text
Issue 6: Duplicate Layout Implementation
Location: src/layouts/PublicLayout.tsx and src/layouts/MainLayout.tsx
Severity: Low
Why it matters: PublicLayout and MainLayout are 95% identical duplicate code with identical markup, footer text, and contact links.
Recommended approach: Merge PublicLayout into MainLayout with an optional prop for printHidden.
```

---

## 11. Security Audit

### Current Demo Limitations vs Real Security Vulnerabilities

| Category | Finding | Current Severity | Production Severity | Analysis & Explanation |
| :--- | :--- | :---: | :---: | :--- |
| **Authentication** | No password verification | ℹ️ Demo Design | 🚨 Critical | Users log in by typing an ID only. Anyone can impersonate any doctor, student, or admin by typing their public ID. |
| **Authorization** | Missing route guards | 🟡 High | 🚨 Critical | `/admin/*`, `/student`, `/receptionist/*`, `/prescription/:id`, and `/certificate/create/:id` have **no route protection**. Direct URL navigation bypasses login completely. |
| **Data Storage** | Plaintext `localStorage` | 🟡 Medium | 🚨 Critical | Patient medical histories, diagnostic tests, and personal phone numbers are stored unencrypted in `localStorage`, accessible by any third-party script or browser extension. |
| **Integrity** | Client-side serial & ID generation | ℹ️ Demo Design | 🔴 High | Serial numbers (`APT-YYYYMMDD-XXX`) and invoice IDs (`INV-XXXX`) are calculated using `Math.random()` on the client. Concurrency collisions are inevitable in multi-user production. |
| **Access Control** | Horizontal Privilege Escalation | 🟡 High | 🚨 Critical | Navigating to `/prescription/view/:id` or `/reports/view/:id` with arbitrary IDs grants immediate visibility to that patient's health records without permission verification. |
| **Input Sanitization** | Basic HTML text rendering | 🟢 Low | 🟡 Medium | React automatically escapes JSX string children, preventing basic XSS. However, no server-side schema validation exists (e.g., Zod, Joi). |

---

## 12. Error & Edge-Case Analysis

| Scenario / Edge Case | Handled? | Evidence / Behavior |
| :--- | :---: | :--- |
| **Booking on Fridays** | ✅ Handled | In [BookAppointmentModal.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/BookAppointmentModal.tsx#L135-L140): Checks `localDate.getDay() === 5` and alerts that the health complex is closed on Fridays, resetting the input. |
| **Booking in the Past** | ✅ Handled | In [BookAppointmentModal.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/student/BookAppointmentModal.tsx#L144): Sets `min` attribute to today's date (`new Date().toISOString().split('T')[0]`). |
| **Out-of-Stock Medication** | ✅ Handled | In [PrescriptionPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/PrescriptionPage.tsx#L59-L62): Checks `selected.stock === 0` and alerts "Out of stock", preventing addition. |
| **Empty Prescription Submission** | ✅ Handled | In [PrescriptionPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/PrescriptionPage.tsx#L95-L98): Validates `medicinesList.length === 0 && selectedTests.length === 0`. |
| **Invalid Patient Search in Consultancy** | ✅ Handled | In [ConsultancyPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/ConsultancyPage.tsx#L26-L29): Displays alert "Patient not found" and maintains empty prompt. |
| **Non-Existent Prescription / Report / Certificate ID** | ✅ Handled | Dedicated fallback views ("Prescription Not Found", "Report not found", "Certificate Not Found") with "Go Back" buttons. |
| **Empty Datasets (Lists)** | ✅ Handled | Clean, dashed-border empty states with icons across all patient, doctor, and pathologist lists. |
| **Invalid Login ID** | 🟡 Partial | Handled via `alert("Invalid ID or role")`. Demo text wrongly recommends `RUET001`. |
| **Invalid / Unknown Routes** | ❌ Not Handled | In [App.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/App.tsx), there is **no catch-all 404 route** (`path="*" element={<NotFoundPage />}`). Unknown URLs render a completely blank page. |
| **Concurrent Booking Serial Collisions** | ❌ Not Handled | Generated on client via `get().appointments.length + 1`. Multiple users booking simultaneously will produce duplicate serial numbers. |
| **Network Failures / API Retries** | ❌ Not Handled | Not applicable currently since no network layer exists. |

---

## 13. Implemented vs Partial vs Missing Summary

### ✅ Fully Implemented (Functional with Local Persistence)
1. **Public Portal**: Home page, Doctors list, Staff list, Medical services catalog, Test rates directory.
2. **Student Portal**: Profile overview, appointment booking (Friday restriction + serial generator), appointment deletion, medical history timeline, validated lab reports list, medical certificates list.
3. **Doctor Portal**: Overview metrics, appointment request approval/rejection, patient ID lookup, live prescription creation with medicine stock checking and diagnostic test dispatch, printable prescription generation with watermark and PDF download.
4. **Medical Certificates**: Issuance with automated calendar day calculations, institutional certificate view, PDF download.
5. **Pathologist Portal**: Dashboard metrics, test request queue, automatic transition to `In Progress`, parameter entry with abnormal flags, report submission, report formal validation, printable pathology report view.
6. **Receptionist Modules**: Test billing invoice creation with Student/Employee pricing tiers, VAT/discount calculators, receipt PDF generation, pharmacy prescription queue, medicine dispensing, and auto-bill shortcut.

### 🟡 Partially Implemented (UI Exists, Functionality Incomplete)
1. **Authentication**: ID-matching mock login without password or session security. Teacher/officer logins throw alerts. Demo text suggests non-existent ID.
2. **Route Authorization**: Route guards implemented only in `DoctorLayout` and `PathologistLayout`. Missing in `AdminLayout`, `/student`, `/receptionist/*`, and direct document views.
3. **Receptionist Patient Management**: Search works, but all creation/edit buttons are inactive stubs.
4. **Doctor Consultancy Treatment History**: Hardcoded mock flu/headache records instead of reading store history.
5. **Admin Dashboard**: Medicine stock updates only update local component `useState` and are lost on reload.

### ❌ Not Implemented (Missing Entirely)
1. **Real Backend Server & API Layer**: No REST/GraphQL server, no HTTP clients (`axios`/`fetch` wrappers).
2. **Database & Migrations**: No persistent database.
3. **Admin Doctor & Medicine CRUD**: `/admin/doctors` and `/admin/medicines` are non-functional stubs (`console.log` only).
4. **Teacher & Officer Portals**: No dashboards or routes exist.
5. **User Registration & Password Management**: No account creation or password reset.
6. **Catch-All 404 Route**: No fallback route for invalid URLs in `App.tsx`.

### ⚠️ Demo/Mock Implementations (Work only because of static data / frontend state)
* Login authentication via [users.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/users.ts).
* Patient demographics via [mockPatients.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/mockPatients.ts).
* Diagnostic test definitions via [tests.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/tests.ts).
* Medicine stock tracking via [medicines.ts](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/data/medicines.ts).
* Cross-role synchronization via browser `localStorage`.

---

## 14. Technical Debt

### Critical Priority (Must address before backend integration)
1. **ESLint / TDZ Bug in ConsultancyPage**: Fix `handleSearch` declaration order in [ConsultancyPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/ConsultancyPage.tsx) so the project passes linting without errors.
2. **Route Protection Architecture**: Implement an `<AuthGuard allowedRoles={[...]} />` wrapper across all protected routes in [App.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/App.tsx).
3. **Connect TreatmentHistory to Store**: Replace static mock history in [TreatmentHistory.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/TreatmentHistory.tsx) with live queries to `usePrescriptionStore`.

### High Priority (Address before production)
1. **Bundle Size & Code Splitting**: Lazy load heavy PDF generation pages (`PrescriptionPage`, `ViewPrescriptionPage`, `TestBilling`, `ReportView`) using `React.lazy()` to reduce the initial 1 MB bundle.
2. **Standardized Notification System**: Replace browser `alert()` and `confirm()` calls with an accessible notification library (e.g., Sonner or React Hot Toast).
3. **Fix Admin State Loss**: Migrate admin medicine stock updates in [AdminDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/AdminDashboard.tsx) into a persistent store or wire them into real CRUD operations.
4. **404 Handling**: Add a catch-all route `<Route path="*" element={<NotFound />} />` in `App.tsx`.

### Medium Priority (Important for maintainability)
1. **Delete Dead Code**: Remove [Footer.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/components/Footer.tsx), [AdminSidebar.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/AdminSidebar.tsx), [NotesPanel.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/NotesPanel.tsx), [PrescriptionPanel.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/PrescriptionPanel.tsx), and [App.css](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/App.css).
2. **Consolidate Layouts**: Merge [PublicLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/PublicLayout.tsx) and [MainLayout.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/layouts/MainLayout.tsx) to eliminate duplicate footer markup.
3. **Fix Login Demo Helper**: Correct `RUET001` in [LoginPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/LoginPage.tsx) to `2204001` or `2204002`.

### Low Priority (Nice-to-have improvements)
1. Fix JSX string literal interpolation in `AdminDashboard.tsx` line 119 (`aria-label={'Stock for ${m.name}'}`).
2. Implement sub-navigation tabs in `PathologistLayout.tsx` matching `DoctorLayout.tsx`.

---

## 15. Production Readiness Assessment

| Dimension | Score (0–10) | Detailed Justification |
| :--- | :---: | :--- |
| **Functionality** | **6.5 / 10** | Doctor, Student, Receptionist, and Pathologist core flows are surprisingly thorough and interactive. However, Admin is non-functional, Teacher/Officer dashboards do not exist, and registration is missing. |
| **UI / UX** | **8.0 / 10** | Very strong visual presentation. Professional university branding, clean color schemes, excellent printable document outputs with watermarks. Dragged down only by native `alert()` dialogs and empty admin screens. |
| **Architecture** | **6.0 / 10** | Good feature-based directory structure and Zustand store partitioning. Lacks an API communication layer, HTTP interceptors, route-guard abstractions, and code splitting. |
| **Code Quality** | **6.5 / 10** | TypeScript compiles with zero errors, types are well-modeled. However, ESLint fails due to a variable declaration order issue, and several orphaned files clutter the codebase. |
| **Security** | **1.0 / 10** | Unacceptable for production. No passwords, no JWTs, unencrypted plaintext localStorage, multiple sensitive routes completely unprotected, no server-side access control. |
| **Accessibility** | **5.5 / 10** | Semantic HTML is partially used. Good contrast ratios. Lacks ARIA attributes on modals and complex custom select dropdowns, relies on browser alerts. |
| **Responsiveness** | **7.5 / 10** | Responsive mobile navigation drawer, fluid grid layouts, and horizontal scroll wrappers on tables. Some PDF preview containers are wide on small mobile screens. |
| **Backend Readiness**| **5.0 / 10** | Data contracts (types/interfaces) in `src/types/` and Zustand store actions map very cleanly to future REST endpoints. However, no HTTP service layer exists yet. |
| **Database Readiness**| **4.5 / 10** | Relational schemas between patients, appointments, prescriptions, bills, and lab reports are conceptually clear, but no SQL schemas, ORM models, or migration scripts exist. |
| **Scalability** | **3.5 / 10** | Client-side `localStorage` cannot scale beyond one user on one device. Large un-split 1 MB bundle slows initial load. |
| **Maintainability** | **7.0 / 10** | Clean, readable, modular React code. Easily navigable by any new developer once dead code is pruned. |
| **Overall Production Readiness** | **4.0 / 10** | **Ready as a high-fidelity client demo / design prototype, but completely unready for production deployment until a backend, database, and real authentication are built.** |

---

## 16. Overall Architecture Diagram

```text
RUET Medical Application (Single Page App)
│
├── Entry & Routing (main.tsx -> App.tsx)
│   ├── HashRouter (/#/)
│   └── ScrollToTop Controller
│
├── Security & Session Layer
│   ├── useAuthStore (localStorage: "auth-storage")
│   └── Route Guards:
│       ├── DoctorLayout Guard (checks role === 'doctor')
│       ├── PathologistLayout Guard (checks role === 'pathologist')
│       └── [UNGUARDED]: Student, Receptionist, Admin, Documents
│
├── Layout Shells
│   ├── PublicLayout (Public Pages + Header + Footer)
│   ├── MainLayout (Standard App Shell + Print Helpers)
│   ├── DoctorLayout (Doctor Horizontal Tabs + Guard + Outlet)
│   ├── PathologistLayout (Pathologist Guard + Outlet)
│   └── AdminLayout (Admin Horizontal Tabs + Outlet)
│
├── Route Views & Feature Modules
│   │
│   ├── Public Pages
│   │   ├── HomePage (Hero, Ambulance 24/7, Overview)
│   │   ├── PublicServicesPage (Directory of 7 Services)
│   │   ├── PublicDoctorsPage (Doctors Directory)
│   │   ├── PublicStaffPage (Staff Directory)
│   │   ├── PublicTestsPage (32 Tests Price Catalog)
│   │   └── LoginPage (Role selector & ID match)
│   │
│   ├── Student Portal (/student)
│   │   ├── StudentProfile
│   │   ├── BookAppointmentModal (Friday validation, auto serial)
│   │   ├── AppointmentsList (Status badges, deletion)
│   │   ├── MedicalHistory (Prescription timeline)
│   │   ├── LaboratoryReports (Validated reports only)
│   │   └── MedicalCertificates (Leave certificates)
│   │
│   ├── Doctor Portal (/doctor/*)
│   │   ├── DoctorOverview (Stats, upcoming consultations)
│   │   ├── AppointmentsPage (Pending/Accepted/Rejected tabs)
│   │   └── ConsultancyPage (Patient search, lab reports)
│   │
│   ├── Receptionist Portal (/receptionist/*)
│   │   ├── PatientManagement (Search table)
│   │   ├── TestBilling (Student/Employee tiering, invoices)
│   │   └── MedicineDispense (Pharmacy queue, dispense actions)
│   │
│   ├── Pathologist Portal (/pathologist/*)
│   │   ├── PathologistDashboard (Test metrics)
│   │   ├── TestManagement (Pending & report queues)
│   │   ├── TestDetails (Parameter & flag entry)
│   │   └── PathologistProfile (Read-only bio)
│   │
│   ├── Admin Portal (/admin/*)
│   │   ├── AdminDashboard (Stats, mock doctor remove, local stock edit)
│   │   ├── DoctorsPage (Stub)
│   │   └── MedicinesPage (Stub)
│   │
│   └── Standalone Document Views
│       ├── PrescriptionPage (Doctor creation)
│       ├── ViewPrescriptionPage (Watermarked Rx view + PDF)
│       ├── CreateCertificatePage (Doctor issuance)
│       ├── ViewCertificatePage (Watermarked MC view + PDF)
│       └── ReportView (Watermarked Pathology report + Validation + PDF)
│
├── State Management (Zustand + Persist Middleware)
│   ├── useAuthStore            --> localStorage: "auth-storage"
│   ├── useAppointmentStore     --> localStorage: "appointment-storage"
│   ├── usePrescriptionStore    --> localStorage: "prescription-storage"
│   ├── useLaboratoryStore      --> localStorage: "laboratory-storage"
│   ├── useBillingStore         --> localStorage: "billing-storage"
│   └── useCertificateStore     --> localStorage: "medical-certificates-storage"
│
├── Data & Fixture Layer
│   ├── users.ts (9 Demo accounts)
│   ├── mockPatients.ts (2 Student records)
│   ├── tests.ts (32 Diagnostic tests)
│   ├── medicines.ts (4 Medicine records)
│   └── siteSettings.ts (Hours & emergency phone numbers)
│
└── Future Integration Layer (Currently Missing)
    ├── REST API Client (Axios / Fetch)
    ├── Backend Server (Node.js / Express / Django)
    ├── Relational Database (PostgreSQL / MySQL)
    └── Authentication Server (JWT / Session Cookie)
```

---

## 17. Important Findings

### What is Already Strong
1. **Domain Workflow Continuity**: The interconnected state between Doctor prescribing → tests sent to Pathologist → Pathologist entering parameters and validating → reports appearing in Doctor Consultancy and Student Dashboard is exceptionally well coordinated.
2. **Document Presentation & PDF Export**: The prescription, medical certificate, and pathology report views are designed with high graphic fidelity, incorporating university watermarks, accurate Bangladesh university medical formats, and working PDF download/print capabilities.
3. **TypeScript Safety**: High level of type coverage (`tsc -b` passes with zero type errors), with complete interface definitions for medical records, lab parameters, and appointment lifecycles.
4. **Tailwind Styling**: Clean, cohesive, responsive aesthetic suited for an institutional healthcare facility.

### What Needs Improvement
1. **ESLint Error**: [ConsultancyPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/ConsultancyPage.tsx) calls `handleSearch` before declaration, breaking the linter and creating a potential runtime error on query parameter routing.
2. **Route Authorization**: Route guards must be centralized and applied to all protected routes (`/student`, `/admin/*`, `/receptionist/*`, `/prescription/*`, `/certificate/*`).
3. **Admin Modules**: Admin pages for doctors and medicines are completely non-functional stubs that log to the console.
4. **User Feedback**: Replace all native `alert()` and `confirm()` prompts with non-blocking toast notifications.

### What is Missing
1. **Backend & Database**: No server, API client, or persistent database exists.
2. **Actual Authentication**: No password verification, JWT handling, or session management.
3. **Patient Registration**: No mechanism to register a new student, teacher, or staff member.
4. **Teacher & Officer Portals**: Role stubs throw alerts upon login.
5. **404 Catch-All Route**: Missing fallback route in `App.tsx`.

### What Could Break
1. **`ConsultancyPage.tsx` TDZ Crash**: If navigated to with `?patientId=`, the component risks throwing a JavaScript runtime error due to accessing an uninitialized `const` function inside `useEffect`.
2. **Bundle Size Degradation**: Loading `jspdf` and `html2canvas` in the main bundle results in a 1 MB initial chunk that will slow load times on low-bandwidth mobile networks.
3. **Data Loss in Admin Stock Management**: Any medicine stock changes made in `AdminDashboard` will disappear as soon as the user refreshes or changes routes.
4. **Concurrent Serial Collisions**: If deployed to multiple users without a backend, appointment serial numbers will duplicate.

### What Should Be Done Next (Prioritized Roadmap)

#### Phase 1: Codebase Cleanup & Stability (Immediate)
1. Fix the `handleSearch` order bug in [ConsultancyPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/ConsultancyPage.tsx) to achieve a clean `npm run lint`.
2. Delete orphaned files: [Footer.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/components/Footer.tsx), [AdminSidebar.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/AdminSidebar.tsx), [NotesPanel.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/NotesPanel.tsx), [PrescriptionPanel.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/PrescriptionPanel.tsx), [App.css](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/App.css).
3. Correct the demo ID typo in [LoginPage.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/pages/LoginPage.tsx) (`RUET001` → `2204001`).
4. Add a catch-all 404 page in [App.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/App.tsx).
5. Wrap routes in a reusable `<ProtectedRoute allowedRoles={[...]} />` component.

#### Phase 2: Frontend Completeness (Short Term)
1. Convert [AdminDashboard.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/admin/AdminDashboard.tsx) medicine stock into a persistent store slice so stock changes persist across sessions.
2. Complete the Admin doctor and medicine forms to actually append items to the lists rather than logging to `console.log`.
3. Implement a "New Patient Registration" modal on `/receptionist/patients`.
4. Connect [TreatmentHistory.tsx](file:///e:/Career%20Mission/RUET%20Medical/ruet-medical-frontend/src/features/doctor/TreatmentHistory.tsx) to `usePrescriptionStore`.
5. Implement dynamic imports (`React.lazy`) for PDF-heavy pages to drop chunk size below 300 kB.

#### Phase 3: Backend & Production Deployment (Medium Term)
1. Build a REST API backend (e.g., Node.js/Express, NestJS, or FastAPI) with PostgreSQL/MySQL.
2. Implement secure authentication (bcrypt password hashing, JWT access/refresh tokens, role-based middleware).
3. Create an API service layer in `src/services/` with Axios/Fetch interceptors to replace Zustand's `localStorage` persist middleware.
4. Add server-side validation and database-backed concurrency for serial and invoice generation.

---

## 18. Final Executive Summary

1. **What has been built?**
   A high-fidelity, feature-rich React Single-Page Application for the RUET Health Complex. It covers public information portals, an appointment scheduling system, doctor consultancy workflows, clinical prescription generation, diagnostic test billing, pharmacy dispensing, and laboratory pathology reporting with printable PDF exports.

2. **What actually works?**
   The core clinical and operational pipelines are fully interactive: booking appointments, accepting/rejecting requests, searching patient records, generating prescriptions with stock checks, issuing medical leave certificates, billing tests, processing lab parameters, validating lab reports, and generating formatted PDF documents. All changes persist in `localStorage` across reloads.

3. **What is only UI/demo functionality?**
   Authentication is a simulation (users log in with just an ID string; no passwords exist). Admin doctor and medicine forms only execute `console.log`. Patient management in the receptionist portal displays static records with inactive action buttons. Treatment history in consultancy displays hardcoded static mock ailments.

4. **What is incomplete?**
   Route-level authorization is missing on most pages. Admin CRUD operations are stubs. The Teacher and Officer roles have no dashboards and throw alerts. Patient registration is absent.

5. **What is missing entirely?**
   A real backend server, an API communication layer, a persistent database, password-based authentication, and server-side validation.

6. **How is the application architected?**
   It uses a modular, feature-based React 19 structure bundled with Vite, styled with Tailwind CSS, routed with React Router 7 (`HashRouter`), and managed with 6 persisted Zustand state stores.

7. **How do the different user roles interact with it?**
   Students request appointments and view their prescriptions/reports/certificates; Doctors accept visits, prescribe medication, and order lab tests; Receptionists bill diagnostic tests and dispense medications; Pathologists receive test orders, input findings, and validate official reports.

8. **How ready is it for backend/database integration?**
   **High architectural readiness, zero code implementation**. The TypeScript interfaces and Zustand action signatures map 1-to-1 to standard RESTful API endpoints. Replacing store actions with API calls will be straightforward.

9. **What are the biggest technical risks?**
   * Zero security: any user can access any record or route by altering the URL.
   * Runtime lint error in `ConsultancyPage.tsx` that risks crashing when opened with a query parameter.
   * A 1 MB un-split bundle containing `jspdf` and `html2canvas`.
   * Complete data isolation to the local browser device.

10. **What should be implemented next?**
    Fix the `ConsultancyPage.tsx` lint error, remove the dead code files, implement proper route guards, replace browser `alert()` popups with toast notifications, and begin building the backend API and database.
