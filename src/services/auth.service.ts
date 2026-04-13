// Servicios de autenticacion y manejo de sesiones sobre Supabase.
import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabase";

const getAppUrl = (path: string) => {
    const appBaseUrl = import.meta.env.VITE_APP_URL?.trim() || window.location.origin;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${appBaseUrl}${normalizedPath}`;
};

export const getAuthErrorMessage = (error: unknown) => {
    const message =
        typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: string }).message ?? "")
            : "";

    const normalized = message.toLowerCase();

    if (normalized.includes("user already registered") || normalized.includes("already been registered")) {
        return "Este correo ya está registrado. Inicia sesión o usa otro correo.";
    }

    if (normalized.includes("invalid login credentials")) {
        return "Credenciales inválidas. Verifica tu correo y contraseña.";
    }

    if (normalized.includes("password should be at least")) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (normalized.includes("email not confirmed")) {
        return "Debes confirmar tu correo antes de iniciar sesión.";
    }

    if (normalized.includes("configura vite_supabase_url") || normalized.includes("vite_supabase_anon_key")) {
        return "Falta configurar Supabase en .env.local (URL y ANON KEY).";
    }

    return "Ocurrió un error de autenticación. Inténtalo nuevamente.";
};

export const signUp = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: getAppUrl("/"),
        },
    });

    if (error) {
        throw error;
    }

    return data;
};

export const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    // Guardar timestamp de actividad
    updateLastActivityTime();

    // Gestionar persistencia según rememberMe
    if (data.session) {
        if (rememberMe) {
            // Mantener en localStorage (persistente)
            localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
            localStorage.setItem('solix.rememberMe', 'true');
            sessionStorage.removeItem('supabase.temp.token');
        } else {
            // Guardar solo en sessionStorage (temporal)
            sessionStorage.setItem('supabase.temp.token', JSON.stringify(data.session));
            localStorage.removeItem('supabase.auth.token');
            localStorage.setItem('solix.rememberMe', 'false');
        }
    }

    return data;
};

export const requestPasswordReset = async (email: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAppUrl("/cambiar-clave"),
    });

    if (error) {
        throw error;
    }

    return data;
};

export const updateUserAvatar = async (userId: string, file: File) => {
    const supabase = getSupabaseClient();
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
            cacheControl: "31536000",
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data: publicData } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const avatarUrl = `${publicData.publicUrl}?t=${Date.now()}`;

    const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);

    if (profileError) {
        throw profileError;
    }

    const { data, error } = await supabase.auth.updateUser({
        data: {
            avatar_url: avatarUrl,
        },
    });

    if (error) {
        throw error;
    }

    return data;
};

export const updatePassword = async (newPassword: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        throw error;
    }

    return data;
};

export const signOut = async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }

    // Limpiar tanto localStorage como sessionStorage
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.temp.token');
    localStorage.removeItem('solix.rememberMe');
    localStorage.removeItem('solix.lastActivity');
    sessionStorage.removeItem('solix.lastActivity');
};

export const getCurrentUser = async (): Promise<User | null> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    return data.user;
};

// Guardar timestamp de última actividad
export const updateLastActivityTime = () => {
    const timestamp = Date.now();
    sessionStorage.setItem('solix.lastActivity', timestamp.toString());
    localStorage.setItem('solix.lastActivity', timestamp.toString());
};

// Verificar si la sesión expiró por inactividad (15 minutos después de cerrar pestaña sin recordar sesión)
const INACTIVITY_THRESHOLD = 15 * 60 * 1000; // 15 minutos

export const checkInactivityTimeout = async (): Promise<boolean> => {
    const lastActivity = Math.max(
        parseInt(sessionStorage.getItem('solix.lastActivity') || '0'),
        parseInt(localStorage.getItem('solix.lastActivity') || '0')
    );

    if (lastActivity === 0) {
        return false; // No hay registro de actividad
    }

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;

    if (timeSinceLastActivity > INACTIVITY_THRESHOLD) {
        // Sesión expiró por inactividad, hacer logout
        await signOut();
        return true;
    }

    return false;
};
