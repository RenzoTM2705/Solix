import { getSupabaseClient } from "./supabase";
import type { Profile } from "../types/profile";

const TABLE_NAME = "profiles";

export const getProfile = async (userId: string): Promise<Profile | null> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("id, monto_inicial, is_configured")
        .eq("id", userId)
        .maybeSingle();

    if (error) {
        throw error;
    }

    return (data as Profile | null) ?? null;
};

export const createProfile = async (userId: string, monto: number): Promise<Profile> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert({
            id: userId,
            monto_inicial: monto,
            is_configured: true,
        })
        .select("id, monto_inicial, is_configured")
        .single();

    if (error) {
        throw error;
    }

    return data as Profile;
};

export const updateProfile = async (userId: string, monto: number): Promise<Profile> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
            monto_inicial: monto,
            is_configured: true,
        })
        .eq("id", userId)
        .select("id, monto_inicial, is_configured")
        .single();

    if (error) {
        throw error;
    }

    return data as Profile;
};
