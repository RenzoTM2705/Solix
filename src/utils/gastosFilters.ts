// Filtros y helpers para la vista de gastos programados.
import type { ScheduledTransaction } from "../types/scheduledTransaction";
import { parseDateInPeru } from "./peruDate";

export interface GastosFilters {
    estado: "all" | "pendiente" | "pagado";
    dateRange: "today" | "thisWeek" | "overdue" | "next7" | "all";
    dateStart?: Date;
    dateEnd?: Date;
    amountFilter: "all" | "high" | "low" | "custom";
    amountMin?: number;
    amountMax?: number;
}

export const INITIAL_GASTOS_FILTERS: GastosFilters = {
    estado: "all",
    dateRange: "all",
    amountFilter: "all",
};

const getDateRangeForScheduled = (range: "today" | "thisWeek" | "overdue" | "next7" | "all") => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date;

    switch (range) {
        case "today": {
            startDate = new Date(now);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
        }
        case "thisWeek": {
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1);
            startDate = new Date(now.setDate(diff));
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;
        }
        case "overdue": {
            startDate = new Date(2000, 0, 1);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
        }
        case "next7": {
            startDate = new Date(now);
            endDate = new Date(now);
            endDate.setDate(endDate.getDate() + 7);
            endDate.setHours(23, 59, 59, 999);
            break;
        }
        case "all":
        default: {
            startDate = new Date(2000, 0, 1);
            endDate = new Date(2099, 11, 31);
            break;
        }
    }

    return { startDate, endDate };
};

export const filterScheduledTransactions = (
    transactions: ScheduledTransaction[],
    filters: GastosFilters
): ScheduledTransaction[] => {
    return transactions.filter((transaction) => {
        // Filtro de estado
        if (filters.estado !== "all" && transaction.estado !== filters.estado) {
            return false;
        }

        // Filtro de fecha programada
        let startDate: Date;
        let endDate: Date;
        if (filters.dateStart) {
            startDate = filters.dateStart;
            endDate = filters.dateEnd || new Date(filters.dateStart.getFullYear(), filters.dateStart.getMonth() + 1, 0, 23, 59, 59);
        } else {
            const range = getDateRangeForScheduled(filters.dateRange);
            startDate = range.startDate;
            endDate = range.endDate;
        }
        const txDate = parseDateInPeru(transaction.fecha_programada);
        if (!txDate || txDate < startDate || txDate > endDate) {
            return false;
        }

        // Filtro de monto
        const monto = Number(transaction.monto || 0);
        switch (filters.amountFilter) {
            case "high":
                if (monto <= 100) return false;
                break;
            case "low":
                if (monto >= 100) return false;
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
