import { useMemo } from "react";
import { createPortal } from "react-dom";
import { useProfile } from "../hooks/useProfile";
import { useScheduledTransactions } from "../hooks/useScheduledTransactions";
import { useTransactions } from "../hooks/useTransactions";
import { parseDateInPeru } from "../utils/peruDate";

type NotificationItem = {
    id: string;
    title: string;
    detail: string;
    level: "high" | "medium" | "info";
};

const formatCurrency = (amount: number) => {
    return `S/${Math.abs(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const getDayDifference = (targetDate: Date, baseDate: Date) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
    const base = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()).getTime();
    return Math.round((target - base) / oneDay);
};

const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const mondayDiff = day === 0 ? -6 : 1 - day;
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() + mondayDiff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
};

type TopBarNotificationsProps = {
    top: number;
    left: number;
    width: number;
    contentMaxHeight: number;
    nowTimestamp: number;
};

export const TopBarNotifications = ({ top, left, width, contentMaxHeight, nowTimestamp }: TopBarNotificationsProps) => {
    const { data: transactions } = useTransactions();
    const { data: scheduledTransactions } = useScheduledTransactions();
    const { profile } = useProfile();

    const notifications = useMemo(() => {
        const items: NotificationItem[] = [];
        const now = new Date();

        const pendingScheduled = scheduledTransactions.filter((item) => item.estado === "pendiente");
        const dueToday = pendingScheduled.filter((item) => {
            const date = parseDateInPeru(item.fecha_programada);
            return !!date && getDayDifference(date, now) === 0;
        });
        const dueTomorrow = pendingScheduled.filter((item) => {
            const date = parseDateInPeru(item.fecha_programada);
            return !!date && getDayDifference(date, now) === 1;
        });

        if (dueToday.length > 0) {
            const nextDue = dueToday[0];
            items.push({
                id: "scheduled-due-today",
                title: "Gasto programado por vencer",
                detail: `Hoy vence ${nextDue.descripcion} ${formatCurrency(nextDue.monto)}`,
                level: "high",
            });
        }

        if (dueTomorrow.length > 0) {
            items.push({
                id: "scheduled-due-tomorrow",
                title: "Pago pendiente cercano",
                detail: "Tienes un pago pendiente mañana.",
                level: "high",
            });
        }

        const expenses = transactions.filter((item) => item.tipo === "gasto");
        if (expenses.length > 0) {
            const averageExpense = expenses.reduce((sum, item) => sum + Number(item.monto || 0), 0) / expenses.length;
            const sortedExpenses = [...expenses].sort(
                (a, b) => {
                    const dateB = parseDateInPeru(b.fecha)?.getTime() ?? 0;
                    const dateA = parseDateInPeru(a.fecha)?.getTime() ?? 0;
                    return dateB - dateA;
                },
            );
            const unusualExpense = sortedExpenses.find(
                (item) => Number(item.monto || 0) >= Math.max(averageExpense * 1.8, 100),
            );

            if (unusualExpense) {
                items.push({
                    id: "high-expense",
                    title: "Gasto inusual detectado",
                    detail: `Registraste un gasto alto: ${formatCurrency(unusualExpense.monto)}`,
                    level: "medium",
                });
            }
        }

        const monthlyExpenses = expenses.filter((item) => {
            const date = parseDateInPeru(item.fecha);
            return !!date && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });
        const monthlyTotal = monthlyExpenses.reduce((sum, item) => sum + Number(item.monto || 0), 0);
        const monthlyBudget = Number(profile?.monto_inicial ?? 0);

        if (monthlyBudget > 0) {
            const usage = monthlyTotal / monthlyBudget;
            if (usage >= 1) {
                items.push({
                    id: "budget-overflow",
                    title: "Presupuesto excedido",
                    detail: "Ya superaste tu presupuesto estimado del mes.",
                    level: "high",
                });
            } else if (usage >= 0.8) {
                items.push({
                    id: "budget-warning",
                    title: "Consumo de presupuesto alto",
                    detail: "Ya usaste el 80% de tu presupuesto mensual.",
                    level: "medium",
                });
            }
        }

        const todayExpenses = expenses.filter((item) => {
            const date = parseDateInPeru(item.fecha);
            return !!date && getDayDifference(date, now) === 0;
        });
        if (todayExpenses.length > 0) {
            const totalToday = todayExpenses.reduce((sum, item) => sum + Number(item.monto || 0), 0);
            items.push({
                id: "daily-summary",
                title: "Resumen diario",
                detail: `Hoy gastaste ${formatCurrency(totalToday)} en ${todayExpenses.length} transacción(es).`,
                level: "info",
            });
        }

        const currentWeekStart = getStartOfWeek(now);
        const previousWeekStart = new Date(currentWeekStart);
        previousWeekStart.setDate(previousWeekStart.getDate() - 7);

        const currentWeekTotal = expenses
            .filter((item) => {
                const date = parseDateInPeru(item.fecha);
                return !!date && date >= currentWeekStart;
            })
            .reduce((sum, item) => sum + Number(item.monto || 0), 0);

        const previousWeekTotal = expenses
            .filter((item) => {
                const date = parseDateInPeru(item.fecha);
                return !!date && date >= previousWeekStart && date < currentWeekStart;
            })
            .reduce((sum, item) => sum + Number(item.monto || 0), 0);

        if (previousWeekTotal > 0 && currentWeekTotal > previousWeekTotal) {
            items.push({
                id: "weekly-summary",
                title: "Resumen semanal",
                detail: "Esta semana gastaste más que la anterior.",
                level: "info",
            });
        }

        const sortedByDate = [...transactions].sort(
            (a, b) => {
                const dateB = parseDateInPeru(b.fecha)?.getTime() ?? 0;
                const dateA = parseDateInPeru(a.fecha)?.getTime() ?? 0;
                return dateB - dateA;
            },
        );
        const lastMovement = sortedByDate[0];

        if (!lastMovement) {
            items.push({
                id: "inactivity-empty",
                title: "Actividad pendiente",
                detail: "Aún no registras movimientos. Empieza hoy.",
                level: "info",
            });
        } else {
            const lastMovementDate = parseDateInPeru(lastMovement.fecha);
            const daysWithoutActivity = lastMovementDate ? getDayDifference(now, lastMovementDate) : 0;
            if (daysWithoutActivity >= 3) {
                items.push({
                    id: "inactivity-warning",
                    title: "Recordatorio de actividad",
                    detail: `No registras movimientos desde hace ${daysWithoutActivity} días.`,
                    level: "medium",
                });
            }
        }

        const storedAction = sessionStorage.getItem("solix:last_action");
        if (storedAction) {
            try {
                const parsed = JSON.parse(storedAction) as { message?: string; timestamp?: number };
                const timestamp = Number(parsed.timestamp ?? 0);
                if (parsed.message && timestamp > 0 && nowTimestamp - timestamp <= 1000 * 60 * 30) {
                    items.push({
                        id: "action-confirmation",
                        title: "Confirmación",
                        detail: parsed.message,
                        level: "info",
                    });
                }
            } catch {
                sessionStorage.removeItem("solix:last_action");
            }
        }

        return items.slice(0, 8);
    }, [nowTimestamp, profile?.monto_inicial, scheduledTransactions, transactions]);

    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div
            className="fixed z-[320] overflow-hidden rounded-[24px] border border-[rgba(195,198,214,0.25)] bg-white shadow-[0_20px_40px_0_rgba(19,27,46,0.14)]"
            style={{ top, left, width }}
        >
            <div className="border-b border-[rgba(195,198,214,0.22)] px-4 py-3">
                <p className="[font-family:'Inter-SemiBold',Helvetica] text-[13px] font-semibold text-[#131b2e]">
                    Notificaciones
                </p>
            </div>

            <div className="overflow-y-auto p-2" style={{ maxHeight: contentMaxHeight }}>
                {notifications.length === 0 ? (
                    <div className="rounded-[16px] px-3 py-4 text-[13px] text-[#64748b]">
                        No hay notificaciones por ahora.
                    </div>
                ) : (
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            className={`mb-1 rounded-[16px] px-3 py-3 ${
                                item.level === "high"
                                    ? "bg-[#fff1f0]"
                                    : item.level === "medium"
                                        ? "bg-[#fff8e8]"
                                        : "bg-[#f4f7ff]"
                            }`}
                        >
                            <p className="[font-family:'Inter-SemiBold',Helvetica] text-[13px] font-semibold text-[#131b2e]">
                                {item.title}
                            </p>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[12px] text-[#475569]">
                                {item.detail}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>,
        document.body,
    );
};
