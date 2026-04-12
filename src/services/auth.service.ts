import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabase";

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
    });

    if (error) {
        throw error;
    }

    return data;
};

export const signIn = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
};

export const getCurrentUser = async (): Promise<User | null> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    return data.user;
};
