import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { updateLastActivityTime } from "../services/auth.service";

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutos de inactividad con pestaña abierta

export const useInactivityTimeout = () => {
    const { logout } = useAuth();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimeout = () => {
        // Actualizar timestamp de actividad
        updateLastActivityTime();

        // Limpiar timeout anterior si existe
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Establecer nuevo timeout
        timeoutRef.current = setTimeout(() => {
            // Cerrar sesión por inactividad
            logout();
        }, INACTIVITY_TIMEOUT);
    };

    useEffect(() => {
        // Eventos que resetean el timeout de inactividad
        const events = [
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
            "click",
            "mousemove",
        ];

        const handleActivity = () => {
            resetTimeout();
        };

        // Agregar listeners a todos los eventos
        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        // Iniciar el timeout
        resetTimeout();

        // Limpiar al desmontar o cuando se cambie el usuario
        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [logout]);

    return { resetTimeout };
};
