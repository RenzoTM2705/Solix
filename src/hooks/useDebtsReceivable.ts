// Hook para listar y mutar las deudas por cobrar del usuario.
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
    createDebtReceivable,
    deleteDebtReceivable as deleteDebtReceivableService,
    getDebtsReceivable,
    updateDebtReceivable as updateDebtReceivableService,
} from "../services/debtsReceivable.service";
import type {
    CreateDebtReceivableInput,
    DebtReceivable,
    DebtReceivableStatus,
} from "../types/debtReceivable";

const debtsReceivableCache = new Map<string, DebtReceivable[]>();
const debtsReceivableInFlight = new Map<string, Promise<DebtReceivable[]>>();

const getErrorMessage = (err: unknown) => {
    if (typeof err === "object" && err !== null && "message" in err) {
        const message = (err as { message?: string }).message;
        if (message) {
            return String(message);
        }
    }

    return "No se pudo completar la operación de deudas por cobrar.";
};

const fetchDebtsReceivableCached = (userId: string, force = false) => {
    if (!force && debtsReceivableCache.has(userId)) {
        return Promise.resolve(debtsReceivableCache.get(userId) ?? []);
    }

    if (!force && debtsReceivableInFlight.has(userId)) {
        return debtsReceivableInFlight.get(userId) as Promise<DebtReceivable[]>;
    }

    const request = getDebtsReceivable(userId)
        .then((debts) => {
            debtsReceivableCache.set(userId, debts);
            return debts;
        })
        .finally(() => {
            debtsReceivableInFlight.delete(userId);
        });

    debtsReceivableInFlight.set(userId, request);
    return request;
};

const notifyAction = (message: string) => {
    const payload = { message, timestamp: Date.now() };
    if (typeof window === "undefined") {
        return;
    }

    sessionStorage.setItem("solix:last_action", JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("solix:action", { detail: payload }));
};

export type AddDebtReceivableInput = Omit<CreateDebtReceivableInput, "user_id">;

export const useDebtsReceivable = () => {
    const { user, loading: authLoading } = useAuth();
    const [data, setData] = useState<DebtReceivable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshDebtsReceivable = useCallback(
        async (force = false) => {
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
                const debts = await fetchDebtsReceivableCached(user.id, force);
                setData(debts);
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        },
        [authLoading, user?.id],
    );

    const addDebtReceivable = useCallback(
        async (payload: AddDebtReceivableInput) => {
            if (!user?.id) {
                throw new Error("Debes iniciar sesión para registrar deudas por cobrar.");
            }

            setError(null);

            try {
                const created = await createDebtReceivable({
                    ...payload,
                    user_id: user.id,
                });

                setData((prev) => {
                    const next = [created, ...prev];
                    debtsReceivableCache.set(user.id, next);
                    return next;
                });

                notifyAction(`Se registró la deuda de ${created.nombre_persona} por ${created.monto.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}.`);

                return created;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                throw new Error(message);
            }
        },
        [user?.id],
    );

    const updateDebtStatus = useCallback(
        async (id: string, estado: DebtReceivableStatus) => {
            if (!user?.id) {
                throw new Error("Debes iniciar sesión para actualizar deudas por cobrar.");
            }

            setError(null);

            try {
                const updated = await updateDebtReceivableService(id, user.id, { estado });

                setData((prev) => {
                    const next = prev.map((item) => (item.id === id ? updated : item));
                    debtsReceivableCache.set(user.id, next);
                    return next;
                });

                return updated;
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                throw new Error(message);
            }
        },
        [user?.id],
    );

    const removeDebtReceivable = useCallback(
        async (id: string) => {
            if (!user?.id) {
                throw new Error("Debes iniciar sesión para eliminar deudas por cobrar.");
            }

            setError(null);

            try {
                await deleteDebtReceivableService(id, user.id);

                setData((prev) => {
                    const next = prev.filter((item) => item.id !== id);
                    debtsReceivableCache.set(user.id, next);
                    return next;
                });
            } catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                throw new Error(message);
            }
        },
        [user?.id],
    );

    useEffect(() => {
        void refreshDebtsReceivable();
    }, [refreshDebtsReceivable]);

    return {
        data,
        loading,
        error,
        refreshDebtsReceivable,
        addDebtReceivable,
        updateDebtStatus,
        removeDebtReceivable,
    };
};