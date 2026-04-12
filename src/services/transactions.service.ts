import { getSupabaseClient } from "./supabase";
import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from "../types/transaction";

const TABLE_NAME = "transactions";

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("id, user_id, fecha, tipo, categoria, descripcion, monto")
        .eq("user_id", userId)
        .order("fecha", { ascending: false });

    if (error) {
        throw error;
    }

    return (data ?? []) as Transaction[];
};

export const createTransaction = async (transaction: CreateTransactionInput): Promise<Transaction> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(transaction)
        .select("id, user_id, fecha, tipo, categoria, descripcion, monto")
        .single();

    if (error) {
        throw error;
    }

    return data as Transaction;
};

export const deleteTransaction = async (id: string, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id).eq("user_id", userId);

    if (error) {
        throw error;
    }
};

export const updateTransaction = async (
    id: string,
    userId: string,
    payload: UpdateTransactionInput,
): Promise<Transaction> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(payload)
        .eq("id", id)
        .eq("user_id", userId)
        .select("id, user_id, fecha, tipo, categoria, descripcion, monto")
        .single();

    if (error) {
        throw error;
    }

    return data as Transaction;
};
