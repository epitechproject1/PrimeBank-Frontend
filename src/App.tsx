import { Routes, Route, Navigate } from "react-router-dom";

import TeamsPage from "./features/teams/pages/TeamsPage";
import LoginPage from "./features/auth/login/pages/LoginPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { RequireAuth } from "./features/auth/login/components/RequireAuth";
import { PublicOnlyRoute } from "./features/auth/login/components/PublicOnlyRoute";
import UsersPage from "./features/users/Page/UserPage";
import { ProfilePage } from "./features/profile";
import { DepartmentsPage } from "./features/departments/pages/DepartmentsPage";
import { RequireAdmin } from "./features/auth/login/components/RequireAdmin";
import { ScheduleAssignmentsManagerPage } from "./features/scheduleAssignment/pages/ScheduleAssignmentsManagerPage";
import { WeekPatternsPage } from "./features/week-pattern/pages/Weekpatternspage";
import { ShiftsPlannerPage } from "./features/shift/page/ShiftsPlannerPage";
import DashboardHome from "./features/dashboard/pages/dashboard.tsx";


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
                    </Route>

                    <Route element={<RequireAdmin />}>
                        <Route path="/planning/shifts" element={<ShiftsPlannerPage />} />
                        <Route path="/planning/assignments" element={<ScheduleAssignmentsManagerPage />} />
                        <Route path="/planning/templates" element={<WeekPatternsPage />} />
                    </Route>

                    <Route path="/teams" element={<TeamsPage />} />
                    <Route path="/departments" element={<DepartmentsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;