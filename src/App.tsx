import { Routes, Route, Navigate } from "react-router-dom";

// 1. Pages & Layouts
import LoginPage from "./features/auth/login/pages/LoginPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import {RequireAuth} from "./features/auth/login/components/RequireAuth.tsx";
import {PublicOnlyRoute} from "./features/auth/login/components/PublicOnlyRoute.tsx";
import UsersPage from "./features/users/Page/UserPage.tsx";

// 3. Composant temporaire (Placeholder pour la page d'accueil)
const DashboardHome = () => (
    <div>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Vue d'ensemble</h1>
        <p>Bienvenue sur votre espace bancaire sécurisé.</p>
    </div>
);

function App() {
    return (
        <Routes>
            {/* ========================================
               ZONE PUBLIQUE (Accessible uniquement si NON connecté)
               ========================================
               Si l'utilisateur est déjà connecté, il est redirigé vers /dashboard
            */}
            <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* ========================================
               ZONE PRIVÉE (Accessible uniquement si connecté)
               ========================================
               Si l'utilisateur n'est pas connecté, il est redirigé vers /login
            */}
            <Route element={<RequireAuth />}>
                {/* Une fois le guard passé, on affiche le Layout (Sidebar + Header) */}
                <Route element={<DashboardLayout />}>

                    {/* Route par défaut du dashboard */}
                    <Route path="/dashboard" element={<DashboardHome />} />
                    <Route path="/users" element={<UsersPage />} />

                    {/* Ajouter tes futures pages ici : */}
                    {/* <Route path="/accounts" element={<AccountsPage />} /> */}
                    {/* <Route path="/transfers" element={<TransfersPage />} /> */}

                </Route>
            </Route>

            {/* ========================================
               REDIRECTION PAR DÉFAUT (Catch-All)
               ========================================
               Si l'URL n'existe pas, on tente d'aller au dashboard.
               - Si connecté : On voit le dashboard.
               - Si pas connecté : RequireAuth nous renvoie au Login.
            */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default App;