import { Routes, Route, Navigate } from "react-router-dom";

// 1. Pages & Layouts
import TeamsPage from "./features/teams/pages/TeamsPage.tsx";
import LoginPage from "./features/auth/login/pages/LoginPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { RequireAuth } from "./features/auth/login/components/RequireAuth.tsx";
import { PublicOnlyRoute } from "./features/auth/login/components/PublicOnlyRoute.tsx";
import UsersPage from "./features/users/Page/UserPage.tsx";
import { ProfilePage } from "./features/profile/index.ts";
import { RequireAdmin } from "./features/auth/login/components/RequireAdmin.tsx";

// 3. Composant temporaire (Placeholder pour la page d'accueil)
const DashboardHome = () => (
    <div>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Vue d'ensemble</h1>
        <p>Bienvenue sur votre espace bancaire securise.</p>
    </div>
);

function App() {
    return (
        <Routes>
            {/* ========================================
               ZONE PUBLIQUE (Accessible uniquement si NON connecte)
               ========================================
               Si l'utilisateur est deja connecte, il est redirige vers /dashboard
            */}
            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* ========================================
               ZONE PRIVEE (Accessible uniquement si connecte)
               ========================================
               Si l'utilisateur n'est pas connecte, il est redirige vers /login
            */}
            <Route element={<RequireAuth />}>
                {/* Une fois le guard passe, on affiche le Layout (Sidebar + Header) */}
                <Route element={<DashboardLayout />}>
                    {/* Route par defaut du dashboard */}
                    <Route path="/dashboard" element={<DashboardHome />} />

                    <Route element={<RequireAdmin />}>
                        <Route path="/users" element={<UsersPage />} />
                    </Route>

                    <Route path="/teams" element={<TeamsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* Ajouter tes futures pages ici : */}
                    {/* <Route path="/accounts" element={<AccountsPage />} /> */}
                    {/* <Route path="/transfers" element={<TransfersPage />} /> */}
                </Route>
            </Route>

            {/* ========================================
               REDIRECTION PAR DEFAUT (Catch-All)
               ========================================
               Si l'URL n'existe pas, on tente d'aller au dashboard.
               - Si connecte : On voit le dashboard.
               - Si pas connecte : RequireAuth nous renvoie au Login.
            */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;
