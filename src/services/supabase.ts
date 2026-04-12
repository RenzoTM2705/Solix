import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

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
            },
        });

        // Restaurar sesión temporal del sessionStorage si existe
        const tempToken = sessionStorage.getItem('supabase.temp.token');
        if (tempToken && !localStorage.getItem('supabase.auth.token')) {
            try {
                const session = JSON.parse(tempToken);
                supabaseInstance.auth.setSession(session);
            } catch (error) {
                console.warn('No se pudo restaurar sesión temporal:', error);
                sessionStorage.removeItem('supabase.temp.token');
            }
        }
    }

    return supabaseInstance;
};

// Exportar como comodo acceso
export const supabase = isSupabaseConfigured ? getSupabaseClient() : null;
