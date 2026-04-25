// Define las rutas públicas y protegidas de Solix.
import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useInactivityTimeout } from "../hooks/useInactivityTimeout";

const ConfigInicial = lazy(() => import("../screens/ConfigInicial").then((m) => ({ default: m.ConfigInicial })));
const CambiarClave = lazy(() => import("../screens/CambiarClave").then((m) => ({ default: m.CambiarClave })));
const ConfirmacionClave = lazy(() => import("../screens/ConfirmacionClave").then((m) => ({ default: m.ConfirmacionClave })));
const Dashboard = lazy(() => import("../screens/Dashboard").then((m) => ({ default: m.Dashboard })));
const DeudasPorCobrar = lazy(() => import("../screens/DeudasPorCobrar").then((m) => ({ default: m.DeudasPorCobrar })));
const GastosProgramados = lazy(() => import("../screens/GastosProgramados").then((m) => ({ default: m.GastosProgramados })));
const Login = lazy(() => import("../screens/Login").then((m) => ({ default: m.Login })));
const RecuperarClave = lazy(() => import("../screens/RecuperarClave").then((m) => ({ default: m.RecuperarClave })));
const RegistroUsuario = lazy(() => import("../screens/RegistroUsuario").then((m) => ({ default: m.RegistroUsuario })));
const Registros = lazy(() => import("../screens/Registros").then((m) => ({ default: m.Registros })));

const RequireConfiguredAuth = ({ children }: { children: React.ReactElement }) => {
    const { user, loading: authLoading } = useAuth();
    useInactivityTimeout();

    if (authLoading) {
        return <div className="min-h-screen w-full bg-[#faf8ff]" />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const RequireAuthForSetup = ({ children }: { children: React.ReactElement }) => {
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useProfile();
    useInactivityTimeout();

    if (authLoading || profileLoading) {
        return <div className="min-h-screen w-full bg-[#faf8ff]" />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (profile?.is_configured) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const RedirectIfAuth = ({ children }: { children: React.ReactElement }) => {
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useProfile();

    if (authLoading || profileLoading) {
        return <div className="min-h-screen w-full bg-[#faf8ff]" />;
    }

    if (user) {
        if (!profile || !profile.is_configured) {
            return <Navigate to="/config-inicial" replace />;
        }

        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export const AppRoutes = () => (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#faf8ff]" />}>
        <Routes>
            <Route
                path="/"
                element={(
                    <RedirectIfAuth>
                        <Login />
                    </RedirectIfAuth>
                )}
            />
            <Route
                path="/registro-usuario"
                element={(
                    <RedirectIfAuth>
                        <RegistroUsuario />
                    </RedirectIfAuth>
                )}
            />
            <Route
                path="/recuperar-clave"
                element={(
                    <RedirectIfAuth>
                        <RecuperarClave />
                    </RedirectIfAuth>
                )}
            />
            <Route
                path="/confirmacion-clave"
                element={(
                    <RedirectIfAuth>
                        <ConfirmacionClave />
                    </RedirectIfAuth>
                )}
            />
            <Route
                path="/cambiar-clave"
                element={<CambiarClave />}
            />
            <Route
                path="/config-inicial"
                element={(
                    <RequireAuthForSetup>
                        <ConfigInicial />
                    </RequireAuthForSetup>
                )}
            />
            <Route
                path="/dashboard"
                element={(
                    <RequireConfiguredAuth>
                        <Dashboard />
                    </RequireConfiguredAuth>
                )}
            />
            <Route
                path="/registros"
                element={(
                    <RequireConfiguredAuth>
                        <Registros />
                    </RequireConfiguredAuth>
                )}
            />
            <Route
                path="/gastos-programados"
                element={(
                    <RequireConfiguredAuth>
                        <GastosProgramados />
                    </RequireConfiguredAuth>
                )}
            />
            <Route
                path="/deudas-por-cobrar"
                element={(
                    <RequireConfiguredAuth>
                        <DeudasPorCobrar />
                    </RequireConfiguredAuth>
                )}
            />
        </Routes>
    </Suspense>
);
