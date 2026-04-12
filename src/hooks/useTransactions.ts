import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { createTransaction, getTransactions, updateTransaction as updateTransactionService } from "../services/transactions.service";
import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from "../types/transaction";
import { getAuthErrorMessage } from "../services/auth.service";

export const useTransactions = () => {
    const { user } = useAuth();
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshTransactions = useCallback(async () => {
        if (!user?.id) {
            setData([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const transactions = await getTransactions(user.id);
            setData(transactions);
        } catch (err) {
            setError(getAuthErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const addTransaction = useCallback(
        async (payload: Omit<CreateTransactionInput, "user_id">) => {
            if (!user?.id) {
                throw new Error("Debes iniciar sesión para agregar transacciones.");
            }

            const created = await createTransaction({
                ...payload,
                user_id: user.id,
            });

            setData((prev) => [created, ...prev]);
            return created;
        },
        [user?.id],
    );

    const editTransaction = useCallback(
        async (id: string, payload: UpdateTransactionInput) => {
            if (!user?.id) {
                throw new Error("Debes iniciar sesión para editar transacciones.");
            }

            const updated = await updateTransactionService(id, user.id, payload);
            setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
            return updated;
        },
        [user?.id],
    );

    useEffect(() => {
        refreshTransactions();
    }, [refreshTransactions]);

    return {
        data,
        loading,
        error,
        addTransaction,
        editTransaction,
        refreshTransactions,
    };
};
