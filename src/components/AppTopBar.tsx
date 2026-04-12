import { useEffect, useMemo, useRef, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { useScheduledTransactions } from "../hooks/useScheduledTransactions";
import { useTransactions } from "../hooks/useTransactions";
import { ProfileMenu } from "./ProfileMenu";

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

export const AppTopBar = () => {
    const { data: transactions } = useTransactions();
    const { data: scheduledTransactions } = useScheduledTransactions();
    const { profile } = useProfile();
    const [isOpen, setIsOpen] = useState(false);
    const [seenNotificationSignature, setSeenNotificationSignature] = useState(() => {
        return sessionStorage.getItem("solix:seen_notifications_signature") ?? "";
    });
    const [lastAction, setLastAction] = useState<{ message: string; timestamp: number } | null>(() => {
        const storedAction = sessionStorage.getItem("solix:last_action");
        if (!storedAction) {
            return null;
        }

        try {
            const parsed = JSON.parse(storedAction) as { message?: string; timestamp?: number };
            if (parsed.message && parsed.timestamp) {
                return { message: parsed.message, timestamp: parsed.timestamp };
            }
        } catch {
            sessionStorage.removeItem("solix:last_action");
        }

        return null;
    });
    const [currentTimestamp, setCurrentTimestamp] = useState(() => Date.now());
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setCurrentTimestamp(Date.now());
        }, 60000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        const handleActionEvent = (event: Event) => {
            const customEvent = event as CustomEvent<{ message?: string; timestamp?: number }>;
            if (!customEvent.detail?.message) {
                return;
            }

            const timestamp = customEvent.detail.timestamp ?? Date.now();
            const payload = { message: customEvent.detail.message, timestamp };
            sessionStorage.setItem("solix:last_action", JSON.stringify(payload));
            setLastAction(payload);
        };

        window.addEventListener("solix:action", handleActionEvent as EventListener);
        return () => {
            window.removeEventListener("solix:action", handleActionEvent as EventListener);
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const notifications = useMemo(() => {
        const items: NotificationItem[] = [];
        const now = new Date();

        const pendingScheduled = scheduledTransactions.filter((item) => item.estado === "pendiente");
        const dueToday = pendingScheduled.filter((item) => {
            const date = new Date(item.fecha_programada);
            return !Number.isNaN(date.getTime()) && getDayDifference(date, now) === 0;
        });
        const dueTomorrow = pendingScheduled.filter((item) => {
            const date = new Date(item.fecha_programada);
            return !Number.isNaN(date.getTime()) && getDayDifference(date, now) === 1;
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
                (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
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
            const date = new Date(item.fecha);
            return !Number.isNaN(date.getTime()) && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
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
            const date = new Date(item.fecha);
            return !Number.isNaN(date.getTime()) && getDayDifference(date, now) === 0;
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
                const date = new Date(item.fecha);
                return !Number.isNaN(date.getTime()) && date >= currentWeekStart;
            })
            .reduce((sum, item) => sum + Number(item.monto || 0), 0);

        const previousWeekTotal = expenses
            .filter((item) => {
                const date = new Date(item.fecha);
                return !Number.isNaN(date.getTime()) && date >= previousWeekStart && date < currentWeekStart;
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
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
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
            const daysWithoutActivity = getDayDifference(now, new Date(lastMovement.fecha));
            if (daysWithoutActivity >= 3) {
                items.push({
                    id: "inactivity-warning",
                    title: "Recordatorio de actividad",
                    detail: `No registras movimientos desde hace ${daysWithoutActivity} días.`,
                    level: "medium",
                });
            }
        }

        if (lastAction && currentTimestamp - lastAction.timestamp <= 1000 * 60 * 30) {
            items.push({
                id: "action-confirmation",
                title: "Confirmación",
                detail: lastAction.message,
                level: "info",
            });
        }

        return items.slice(0, 8);
    }, [currentTimestamp, lastAction, profile?.monto_inicial, scheduledTransactions, transactions]);

    const highPriorityNotifications = useMemo(() => {
        return notifications.filter((item) => item.level === "high" || item.level === "medium");
    }, [notifications]);

    const notificationsSignature = useMemo(() => {
        return highPriorityNotifications.map((item) => `${item.id}:${item.detail}`).join("|");
    }, [highPriorityNotifications]);

    const markNotificationsAsSeen = () => {
        sessionStorage.setItem("solix:seen_notifications_signature", notificationsSignature);
        setSeenNotificationSignature(notificationsSignature);
    };

    const unreadCount =
        notificationsSignature && notificationsSignature !== seenNotificationSignature
            ? highPriorityNotifications.length
            : 0;

    return (
        <header className="flex flex-col gap-3 bg-[rgba(250,248,255,0.8)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <img
                    src="/Solix-logo.ico"
                    alt="Solix Logo"
                    className="h-8 w-8 object-contain"
                />
                <span className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-8 text-[#003d9b]">
                    Solix
                </span>
            </div>

            <div className="flex w-full items-center justify-end gap-3 sm:w-auto sm:gap-4">
                <div ref={wrapperRef} className="relative">
                    <button
                        type="button"
                        aria-label="Abrir notificaciones"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                        onClick={() => {
                            setIsOpen((prev) => {
                                const nextOpen = !prev;
                                if (nextOpen) {
                                    markNotificationsAsSeen();
                                }
                                return nextOpen;
                            });
                        }}
                        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052cc]"
                    >
                        <div className="h-[20px] w-[16px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/4pmBka5dZ8.png)] bg-cover bg-no-repeat" />
                        {unreadCount > 0 && (
                            <div className="absolute right-[2px] top-[2px] flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ba1a1a] px-[3px] text-[10px] font-bold text-white">
                                {Math.min(unreadCount, 9)}
                            </div>
                        )}
                    </button>

                    {isOpen && (
                        <div
                            className="absolute right-0 top-full z-[320] mt-3 w-[340px] overflow-hidden rounded-[24px] border border-[rgba(195,198,214,0.25)] bg-white shadow-[0_20px_40px_0_rgba(19,27,46,0.14)]"
                            onClick={markNotificationsAsSeen}
                        >
                            <div className="border-b border-[rgba(195,198,214,0.22)] px-4 py-3">
                                <p className="[font-family:'Inter-SemiBold',Helvetica] text-[13px] font-semibold text-[#131b2e]">
                                    Notificaciones
                                </p>
                            </div>

                            <div className="max-h-[360px] overflow-y-auto p-2">
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
                        </div>
                    )}
                </div>
                <ProfileMenu avatarClassName="h-10 w-10" />
            </div>
        </header>
    );
};