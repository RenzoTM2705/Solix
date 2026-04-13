import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

type AuthStorageMode = "local" | "session";

let authStorageMode: AuthStorageMode = "local";

export const setAuthStorageMode = (mode: AuthStorageMode) => {
    authStorageMode = mode;
};

const getPrimaryStorage = () => (authStorageMode === "session" ? sessionStorage : localStorage);
const getFallbackStorage = () => (authStorageMode === "session" ? localStorage : sessionStorage);

const authStorage = {
    getItem: (key: string) => getPrimaryStorage().getItem(key) ?? getFallbackStorage().getItem(key),
    setItem: (key: string, value: string) => {
        getPrimaryStorage().setItem(key, value);
        getFallbackStorage().removeItem(key);
    },
    removeItem: (key: string) => {
        getPrimaryStorage().removeItem(key);
        getFallbackStorage().removeItem(key);
    },
};

// Singleton pattern para evitar múltiples instancias
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
    if (!isSupabaseConfigured) {
        throw new Error("Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local para usar autenticacion.");
    }

    if (!supabaseInstance) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                flowType: "pkce", // Recomendado para SPA
                storage: authStorage,
            },
        });
    }

    return supabaseInstance;
};

// Exportar como comodo acceso
export const supabase = isSupabaseConfigured ? getSupabaseClient() : null;
