// Filtros y helpers para el historial de registros financieros.
import type { Transaction } from "../types/transaction";

export interface RegistrosFilters {
    dateRange: "today" | "last7" | "thisMonth" | "custom";
    dateStart?: Date;
    dateEnd?: Date;
    type: "all" | "ingreso" | "gasto";
    amountFilter: "all" | "under50" | "over100" | "custom";
    amountMin?: number;
    amountMax?: number;
}

export const INITIAL_REGISTROS_FILTERS: RegistrosFilters = {
    dateRange: "thisMonth",
    type: "all",
    amountFilter: "all",
};

const getDateRange = (range: "today" | "last7" | "thisMonth" | "custom", customStart?: Date, customEnd?: Date) => {
    const now = new Date();
    let startDate: Date;
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    switch (range) {
        case "today":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            break;
        case "last7":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            startDate.setHours(0, 0, 0, 0);
            break;
        case "thisMonth":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
            break;
        case "custom":
            startDate = customStart || new Date();
            endDate = customEnd || new Date();
            break;
        default:
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    }

    return { startDate, endDate };
};

export const filterTransactions = (transactions: Transaction[], filters: RegistrosFilters): Transaction[] => {
    return transactions.filter((transaction) => {
        // Filtro de fecha
        const { startDate, endDate } = getDateRange(
            filters.dateRange,
            filters.dateStart,
            filters.dateEnd
        );
        const txDate = new Date(transaction.fecha);
        if (txDate < startDate || txDate > endDate) {
            return false;
        }

        // Filtro de tipo
        if (filters.type !== "all" && transaction.tipo !== filters.type) {
            return false;
        }

        // Filtro de monto
        const monto = Math.abs(Number(transaction.monto || 0));
        switch (filters.amountFilter) {
            case "under50":
                if (monto >= 50) return false;
                break;
            case "over100":
                if (monto <= 100) return false;
                break;
            case "custom":
                const min = filters.amountMin || 0;
                const max = filters.amountMax || Infinity;
                if (monto < min || monto > max) return false;
                break;
        }

        return true;
    });
};
