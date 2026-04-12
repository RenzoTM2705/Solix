import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../services/supabase";
import {
    getCurrentUser,
    signIn as signInService,
    signOut as signOutService,
    signUp as signUpService,
    checkInactivityTimeout,
    updateLastActivityTime,
} from "../services/auth.service";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        if (!isSupabaseConfigured || !supabase) {
            setUser(null);
            setLoading(false);
            return () => {
                mounted = false;
            };
        }

        const initializeAuth = async () => {
            try {
                // Verificar si sesión expiró por inactividad
                const hasExpired = await checkInactivityTimeout();
                
                if (hasExpired) {
                    if (mounted) {
                        setUser(null);
                    }
                    return;
                }

                // Verificar si no marcó "Recordar sesión" y ya pasó tiempo
                const rememberMe = localStorage.getItem('solix.rememberMe');
                if (rememberMe === 'false' && sessionStorage.getItem('supabase.temp.token') === null) {
                    // Sesión temporal expiró (pestaña cerrada)
                    await signOutService();
                    if (mounted) {
                        setUser(null);
                    }
                    return;
                }

                const currentUser = await getCurrentUser();
                if (mounted) {
                    setUser(currentUser);
                    if (currentUser) {
                        updateLastActivityTime();
                    }
                }
            } catch {
                if (mounted) {
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = useCallback(async (email: string, password: string, rememberMe: boolean = true) => {
        const data = await signInService(email, password, rememberMe);
        setUser(data.user ?? null);
        return data;
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        const data = await signUpService(email, password);
        setUser(data.user ?? null);
        return data;
    }, []);

    const logout = useCallback(async () => {
        await signOutService();
        setUser(null);
    }, []);

    return {
        user,
        loading,
        login,
        register,
        logout,
    };
};
