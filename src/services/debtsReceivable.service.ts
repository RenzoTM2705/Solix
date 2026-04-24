// Operaciones de lectura y escritura para deudas por cobrar.
import { getSupabaseClient } from "./supabase";
import type {
    CreateDebtReceivableInput,
    DebtReceivable,
    UpdateDebtReceivableInput,
} from "../types/debtReceivable";

const TABLE_NAME = "debts_receivable";

const SELECT_FIELDS =
    "id, user_id, nombre_persona, descripcion, monto, fecha_prestamo, estado, created_at";

export const getDebtsReceivable = async (userId: string): Promise<DebtReceivable[]> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(SELECT_FIELDS)
        .eq("user_id", userId)
        .order("fecha_prestamo", { ascending: false });

    if (error) {
        throw error;
    }

    return (data ?? []) as DebtReceivable[];
};

export const createDebtReceivable = async (
    data: CreateDebtReceivableInput,
): Promise<DebtReceivable> => {
    const supabase = getSupabaseClient();

    const { data: createdDebtReceivable, error } = await supabase
        .from(TABLE_NAME)
        .insert(data)
        .select(SELECT_FIELDS)
        .single();

    if (error) {
        throw error;
    }

    return createdDebtReceivable as DebtReceivable;
};

export const updateDebtReceivable = async (
    id: string,
    userId: string,
    payload: UpdateDebtReceivableInput,
): Promise<DebtReceivable> => {
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

    return data as DebtReceivable;
};

export const deleteDebtReceivable = async (id: string, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();

    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id).eq("user_id", userId);

    if (error) {
        throw error;
    }
};