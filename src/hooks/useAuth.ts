// Hook central de autenticacion: expone estado de usuario, login, registro y logout.
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, setAuthStorageMode, supabase } from "../services/supabase";
import {
    signIn as signInService,
    signOut as signOutService,
    signUp as signUpService,
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

const subscribeToAuthState = () => {
    if (!supabase || authSubscription) {
        return;
    }

    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
        updateAuthSnapshot({
            user: session?.user ?? null,
            loading: false,
        });
    });

    authSubscription = subscription;
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

    subscribeToAuthState();

    authInitPromise = (async () => {
        try {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                throw error;
            }

            updateAuthSnapshot({
                user: data.session?.user ?? null,
                loading: false,
            });
        } catch {
            updateAuthSnapshot({ user: null, loading: false });
        }
    })();

    return authInitPromise;
};

export const useAuth = () => {
    const [snapshot, setSnapshot] = useState<AuthSnapshot>(authSnapshot);

    useEffect(() => {
        authListeners.add(setSnapshot);
        void ensureAuthInitialization();

        return () => {
            authListeners.delete(setSnapshot);
        };
    }, []);

    const login = useCallback(async (email: string, password: string, rememberMe: boolean = true) => {
        setAuthStorageMode(rememberMe ? "local" : "session");

        const data = await signInService(email, password);
        updateAuthSnapshot({
            user: data.session?.user ?? null,
            loading: false,
        });
        return data;
    }, []);

    const register = useCallback(async (email: string, password: string, fullName?: string) => {
        setAuthStorageMode("local");

        const data = await signUpService(email, password, fullName);
        updateAuthSnapshot({
            user: data.session?.user ?? null,
            loading: false,
        });
        return data;
    }, []);

    const logout = useCallback(async () => {
        await signOutService();
        setAuthStorageMode("local");
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
