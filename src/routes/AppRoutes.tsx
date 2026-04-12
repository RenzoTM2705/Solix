import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ConfigInicial } from "../screens/ConfigInicial";
import { Dashboard } from "../screens/Dashboard";
import { GastosProgramados } from "../screens/GastosProgramados";
import { Login } from "../screens/Login";
import { RegistroUsuario } from "../screens/RegistroUsuario";
import { Registros } from "../screens/Registros";

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen w-full bg-[#faf8ff]" />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const RedirectIfAuth = ({ children }: { children: React.ReactElement }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen w-full bg-[#faf8ff]" />;
    }

    if (user) {
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
            path="/config-inicial"
            element={(
                <RequireAuth>
                    <ConfigInicial />
                </RequireAuth>
            )}
        />
        <Route
            path="/dashboard"
            element={(
                <RequireAuth>
                    <Dashboard />
                </RequireAuth>
            )}
        />
        <Route
            path="/registros"
            element={(
                <RequireAuth>
                    <Registros />
                </RequireAuth>
            )}
        />
        <Route
            path="/gastos-programados"
            element={(
                <RequireAuth>
                    <GastosProgramados />
                </RequireAuth>
            )}
        />
    </Routes>
);
