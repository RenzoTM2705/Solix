// Hook para listar y mutar los movimientos financieros del usuario.
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
    createTransaction,
    deleteTransaction as deleteTransactionService,
    getTransactions,
    updateTransaction as updateTransactionService,
} from "../services/transactions.service";
import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from "../types/transaction";
import { getAuthErrorMessage } from "../services/auth.service";

const transactionsCache = new Map<string, Transaction[]>();
const transactionsInFlight = new Map<string, Promise<Transaction[]>>();

const fetchTransactionsCached = (userId: string, force = false) => {
    if (!force && transactionsCache.has(userId)) {
        return Promise.resolve(transactionsCache.get(userId) ?? []);
    }

    if (!force && transactionsInFlight.has(userId)) {
        return transactionsInFlight.get(userId) as Promise<Transaction[]>;
    }

    const request = getTransactions(userId)
        .then((transactions) => {
            transactionsCache.set(userId, transactions);
            return transactions;
        })
        .finally(() => {
            transactionsInFlight.delete(userId);
        });

    transactionsInFlight.set(userId, request);
    return request;
};

export const useTransactions = () => {
    const { user } = useAuth();
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshTransactions = useCallback(async (force = false) => {
        if (!user?.id) {
            setData([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const transactions = await fetchTransactionsCached(user.id, force);
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

            setData((prev) => {
                const next = [created, ...prev];
                transactionsCache.set(user.id, next);
                return next;
            });
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
            setData((prev) => {
                const next = prev.map((item) => (item.id === id ? updated : item));
                transactionsCache.set(user.id, next);
                return next;
            });
            return updated;
        },
        [user?.id],
    );

    const deleteTransaction = useCallback(
        async (id: string) => {
            if (!user?.id) {
                throw new Error("Debes iniciar sesión para eliminar transacciones.");
            }

            await deleteTransactionService(id, user.id);
            setData((prev) => {
                const next = prev.filter((item) => item.id !== id);
                transactionsCache.set(user.id, next);
                return next;
            });
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
        deleteTransaction,
        refreshTransactions,
    };
};
