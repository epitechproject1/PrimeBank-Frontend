import { Routes, Route, Navigate } from "react-router-dom";

// 1. Pages & Layouts
import TeamsPage from "./features/teams/pages/TeamsPage.tsx";
import LoginPage from "./features/auth/login/pages/LoginPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { RequireAuth } from "./features/auth/login/components/RequireAuth.tsx";
import { PublicOnlyRoute } from "./features/auth/login/components/PublicOnlyRoute.tsx";
import UsersPage from "./features/users/Page/UserPage.tsx";
import { ProfilePage } from "./features/profile/index.ts";
import { DepartmentsPage } from "./features/departments/pages/DepartmentsPage.tsx";
import { RequireAdmin } from "./features/auth/login/components/RequireAdmin.tsx";
import {ScheduleAssignmentsManagerPage} from "./features/scheduleAssignment/pages/ScheduleAssignmentsManagerPage.tsx";
import {WeekPatternsPage} from "./features/week-pattern/pages/Weekpatternspage.tsx";
import {ShiftsPlannerPage} from "./features/shift/page/ShiftsPlannerPage.tsx";
import { ContractsPage } from "./features/contract/pages/ContractsPage.tsx";

const DashboardHome = () => (
    <div>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Vue d'ensemble</h1>
        <p>Bienvenue sur votre espace bancaire sécurisé.</p>
    </div>
);

function App() {
    return (
        <Routes>
            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<RequireAuth />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardHome />} />

                    <Route element={<RequireAdmin />}>
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/contracts" element={<ContractsPage />} />
                    </Route>

                    {/* ── PLANNING — routes dédiées ── */}
                    <Route element={<RequireAdmin />}>
                        <Route path="/planning/shifts" element={<ShiftsPlannerPage />} />
                        <Route path="/planning/assignments" element={<ScheduleAssignmentsManagerPage />} />
                        <Route path="/planning/templates" element={<WeekPatternsPage />} />
                    </Route>
                    {/* Redirect /planning → /planning/shifts par défaut */}
                    {/*   <Route path="/planning" element={<MyShiftsPage />} /> */}

                    <Route path="/teams"       element={<TeamsPage />} />
                    <Route path="/departments" element={<DepartmentsPage />} />
                    <Route path="/profile"     element={<ProfilePage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;
