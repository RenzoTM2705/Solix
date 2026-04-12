import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useInactivityTimeout } from "../hooks/useInactivityTimeout";
import { ConfigInicial } from "../screens/ConfigInicial";
import { ConfirmacionClave } from "../screens/ConfirmacionClave";
import { Dashboard } from "../screens/Dashboard";
import { GastosProgramados } from "../screens/GastosProgramados";
import { Login } from "../screens/Login";
import { RecuperarClave } from "../screens/RecuperarClave";
import { RegistroUsuario } from "../screens/RegistroUsuario";
import { Registros } from "../screens/Registros";

const RequireConfiguredAuth = ({ children }: { children: React.ReactElement }) => {
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading } = useProfile();
    useInactivityTimeout();

    if (authLoading || profileLoading) {
        return <div className="min-h-screen w-full bg-[#faf8ff]" />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!profile || !profile.is_configured) {
        return <Navigate to="/config-inicial" replace />;
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
    </Routes>
);
