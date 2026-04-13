// Hook central de autenticacion: expone estado de usuario, login, registro y logout.
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

type AuthSnapshot = {
    user: User | null;
    loading: boolean;
};

let authSnapshot: AuthSnapshot = {
    user: null,
    loading: true,
};

let authInitialized = false;
let authInitPromise: Promise<void> | null = null;
let authSubscription: { unsubscribe: () => void } | null = null;
const authListeners = new Set<(snapshot: AuthSnapshot) => void>();

const emitAuthSnapshot = () => {
    authListeners.forEach((listener) => listener(authSnapshot));
};

const updateAuthSnapshot = (next: Partial<AuthSnapshot>) => {
    authSnapshot = {
        ...authSnapshot,
        ...next,
    };
    emitAuthSnapshot();
};

const ensureAuthInitialization = () => {
    if (authInitialized) {
        return authInitPromise ?? Promise.resolve();
    }

    authInitialized = true;

    if (!isSupabaseConfigured || !supabase) {
        updateAuthSnapshot({ user: null, loading: false });
        return Promise.resolve();
    }

    authInitPromise = (async () => {
        try {
            const hasExpired = await checkInactivityTimeout();

            if (hasExpired) {
                updateAuthSnapshot({ user: null, loading: false });
                return;
            }

            const rememberMe = localStorage.getItem("solix.rememberMe");
            if (rememberMe === "false" && sessionStorage.getItem("supabase.temp.token") === null) {
                await signOutService();
                updateAuthSnapshot({ user: null, loading: false });
                return;
            }

            const currentUser = await getCurrentUser();
            if (currentUser) {
                updateLastActivityTime();
            }

            updateAuthSnapshot({ user: currentUser, loading: false });
        } catch {
            updateAuthSnapshot({ user: null, loading: false });
        }
    })();

    if (!authSubscription) {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            updateAuthSnapshot({ user: session?.user ?? null, loading: false });
        });

        authSubscription = subscription;
    }

    return authInitPromise;
};

export const useAuth = () => {
    const [snapshot, setSnapshot] = useState<AuthSnapshot>(authSnapshot);

    useEffect(() => {
        authListeners.add(setSnapshot);
        setSnapshot(authSnapshot);
        void ensureAuthInitialization();

        return () => {
            authListeners.delete(setSnapshot);
        };
    }, []);

    const login = useCallback(async (email: string, password: string, rememberMe: boolean = true) => {
        const data = await signInService(email, password, rememberMe);
        updateAuthSnapshot({ user: data.user ?? null, loading: false });
        return data;
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        const data = await signUpService(email, password);
        updateAuthSnapshot({ user: data.user ?? null, loading: false });
        return data;
    }, []);

    const logout = useCallback(async () => {
        await signOutService();
        updateAuthSnapshot({ user: null, loading: false });
    }, []);

    return {
        user: snapshot.user,
        loading: snapshot.loading,
        login,
        register,
        logout,
    };
};
