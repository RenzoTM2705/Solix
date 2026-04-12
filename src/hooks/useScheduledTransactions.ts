import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
    createScheduledTransaction,
    deleteScheduledTransaction as deleteScheduledTransactionService,
    getScheduledTransactions,
    updateScheduledTransaction as updateScheduledTransactionService,
} from "../services/scheduledTransactions.service";
import type {
    ScheduledTransaction,
    CreateScheduledTransactionInput,
    UpdateScheduledTransactionInput,
} from "../types/scheduledTransaction";

export type AddScheduledTransactionInput = {
    descripcion: string;
    monto: number;
    categoria: string;
    fecha_programada: string;
};

export const useScheduledTransactions = () => {
    const { user, loading: authLoading } = useAuth();
    const [data, setData] = useState<ScheduledTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getScheduledTransactionsErrorMessage = (err: unknown) => {
        const message =
            typeof err === "object" && err !== null && "message" in err
                ? String((err as { message?: string }).message ?? "")
                : "";

        const normalized = message.toLowerCase();

        if (normalized.includes("row-level security") || normalized.includes("permission denied")) {
            return "No tienes permisos para leer gastos programados. Revisa la política RLS de SELECT en scheduled_transactions.";
        }

        if (normalized.includes("column") || normalized.includes("does not exist")) {
            return "La estructura de scheduled_transactions no coincide con el frontend. Revisa los nombres de columnas.";
        }

        return `No se pudieron cargar los gastos programados. ${message || "Inténtalo nuevamente."}`;
    };

    const refreshScheduledTransactions = useCallback(async () => {
        if (authLoading) {
            setLoading(true);
            return;
        }

        if (!user?.id) {
            setData([]);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const transactions = await getScheduledTransactions(user.id);
            setData(transactions);
        } catch (err) {
            setError(getScheduledTransactionsErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [authLoading, user?.id]);

    const addScheduledTransaction = useCallback(
        async (payload: AddScheduledTransactionInput) => {
            if (!user?.id) {
                throw new Error("Debes iniciar sesión para crear gastos programados.");
            }

            const created = await createScheduledTransaction({
                user_id: user.id,
                descripcion: payload.descripcion,
                monto: payload.monto,
                categoria: payload.categoria,
                fecha_programada: payload.fecha_programada,
                estado: "pendiente",
            });

            setData((prev) => [created, ...prev]);
            return created;
        },
        [user?.id],
    );

    const updateScheduledTransaction = useCallback(
        async (id: string, payload: UpdateScheduledTransactionInput) => {
            if (!user?.id) {
                throw new Error("Debes iniciar sesión para editar gastos programados.");
            }

            const updated = await updateScheduledTransactionService(id, user.id, payload);
            setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
            return updated;
        },
        [user?.id],
    );

    const removeScheduledTransaction = useCallback(
        async (id: string) => {
            if (!user?.id) {
                throw new Error("Debes iniciar sesión para eliminar gastos programados.");
            }

            await deleteScheduledTransactionService(id, user.id);
            setData((prev) => prev.filter((item) => item.id !== id));
        },
        [user?.id],
    );

    useEffect(() => {
        refreshScheduledTransactions();
    }, [refreshScheduledTransactions]);

    return {
        data,
        loading,
        error,
        refreshScheduledTransactions,
        addScheduledTransaction,
        updateScheduledTransaction,
        removeScheduledTransaction,
    };
};
