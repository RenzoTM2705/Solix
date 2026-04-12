import { getSupabaseClient } from "./supabase";
import type {
    CreateScheduledTransactionInput,
    ScheduledTransaction,
    UpdateScheduledTransactionInput,
} from "../types/scheduledTransaction";

const TABLE_NAME = "scheduled_transactions";

const SELECT_FIELDS = "id, user_id, descripcion, categoria, monto, fecha_programada, estado";

export const getScheduledTransactions = async (userId: string): Promise<ScheduledTransaction[]> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(SELECT_FIELDS)
        .eq("user_id", userId)
        .order("fecha_programada", { ascending: true });

    if (error) {
        throw error;
    }

    return (data ?? []) as ScheduledTransaction[];
};

export const createScheduledTransaction = async (
    payload: CreateScheduledTransactionInput,
): Promise<ScheduledTransaction> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.from(TABLE_NAME).insert(payload).select(SELECT_FIELDS).single();

    if (error) {
        throw error;
    }

    return data as ScheduledTransaction;
};

export const updateScheduledTransaction = async (
    id: string,
    userId: string,
    payload: UpdateScheduledTransactionInput,
): Promise<ScheduledTransaction> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(payload)
        .eq("id", id)
        .eq("user_id", userId)
        .select(SELECT_FIELDS)
        .single();

    if (error) {
        throw error;
    }

    return data as ScheduledTransaction;
};

export const deleteScheduledTransaction = async (id: string, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id).eq("user_id", userId);

    if (error) {
        throw error;
    }
};
