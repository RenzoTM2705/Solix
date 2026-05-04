// Vista de deudas por cobrar con resumen, filtros, exportación y acciones de estado.
import { useMemo, useState, useEffect, useRef } from "react";
import { AppTopBar } from "../../components/AppTopBar";
import { DashboardSidebar } from "../../components/DashboardSidebar";
import { useAuth } from "../../hooks/useAuth";
import { useDebtsReceivable } from "../../hooks/useDebtsReceivable";
import type { DebtReceivableStatus } from "../../types/debtReceivable";

const formatCurrency = (value: number) => {
    const formatted = Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `S/ ${formatted}`;
};

const formatDate = (value: string) => {
    if (!value) {
        return "-";
    }

    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusStyles = (estado: DebtReceivableStatus) => {
    if (estado === "pagado") {
        return "bg-[#6cf8bb] text-[#00714d]";
    }

    return "bg-[#ffdad6] text-[#93000a]";
};

type DebtFormState = {
    nombre_persona: string;
    descripcion: string;
    monto: string;
    fecha_prestamo: string;
};

type DebtFiltersState = {
    persona: string;
    estado: "todos" | DebtReceivableStatus;
    dateStart?: Date;
    dateEnd?: Date;
};

const INITIAL_DEBT_FORM: DebtFormState = {
    nombre_persona: "",
    descripcion: "",
    monto: "",
    fecha_prestamo: "",
};

const INITIAL_FILTERS: DebtFiltersState = {
    persona: "",
    estado: "todos",
};

const DebtModal = ({
    open,
    form,
    error,
    submitting,
    onClose,
    onChange,
    onSubmit,
}: {
    open: boolean;
    form: DebtFormState;
    error: string;
    submitting: boolean;
    onClose: () => void;
    onChange: (field: keyof DebtFormState, value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-[rgba(19,27,46,0.45)] px-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-[520px] rounded-[32px] border border-[rgba(195,198,214,0.2)] bg-white p-6 shadow-[0_30px_60px_0_rgba(19,27,46,0.18)] sm:p-8"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-[32px] text-[#131b2e]">
                        Agregar deuda
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 [font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold text-[#434654] hover:bg-[#f2f3ff]"
                    >
                        Cerrar
                    </button>
                </div>

                {error && <p className="mb-4 [font-family:'Inter-Regular',Helvetica] text-sm text-[#dc2626]">{error}</p>}

                <div className="grid grid-cols-1 gap-4">
                    <label className="flex flex-col gap-2">
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                            Persona
                        </span>
                        <input
                            type="text"
                            value={form.nombre_persona}
                            onChange={(e) => onChange("nombre_persona", e.target.value)}
                            className="rounded-full bg-[#f2f3ff] px-5 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                            Descripción
                        </span>
                        <input
                            type="text"
                            value={form.descripcion}
                            onChange={(e) => onChange("descripcion", e.target.value)}
                            className="rounded-full bg-[#f2f3ff] px-5 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                            Monto
                        </span>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.monto}
                            onChange={(e) => onChange("monto", e.target.value)}
                            className="rounded-full bg-[#f2f3ff] px-5 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                            Fecha préstamo
                        </span>
                        <input
                            type="date"
                            value={form.fecha_prestamo}
                            onChange={(e) => onChange("fecha_prestamo", e.target.value)}
                            className="rounded-full bg-[#f2f3ff] px-5 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                        />
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-[rgba(195,198,214,0.5)] px-5 py-2 [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold text-[#434654]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-full bg-[#003d9b] px-5 py-2 [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold text-white disabled:opacity-60"
                    >
                        {submitting ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export const DeudasPorCobrar = () => {
    const { user } = useAuth();
    const {
        data,
        loading,
        error,
        addDebtReceivable,
        updateDebtStatus,
        removeDebtReceivable,
    } = useDebtsReceivable();

    const [actionError, setActionError] = useState<string | null>(null);
    const [modalError, setModalError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<DebtFormState>(INITIAL_DEBT_FORM);
    const [filters, setFilters] = useState<DebtFiltersState>(INITIAL_FILTERS);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [submitting, setSubmitting] = useState(false);

    const minAllowedMonth = useMemo(() => {
        if (!user?.created_at) {
            return null;
        }

        const createdAt = new Date(user.created_at);
        if (Number.isNaN(createdAt.getTime())) {
            return null;
        }

        return new Date(createdAt.getFullYear(), createdAt.getMonth(), 1, 0, 0, 0);
    }, [user?.created_at]);

    const clampMonth = (month: Date) => {
        if (!minAllowedMonth) {
            return month;
        }

        return month.getTime() < minAllowedMonth.getTime() ? minAllowedMonth : month;
    };

    const changeMonth = (delta: number) => {
        setCurrentMonth((prev) => {
            const firstDate = data && data.length > 0 && data[0].fecha_prestamo ? new Date(data[0].fecha_prestamo + "T00:00:00") : null;
            const base = (filters.dateStart as Date) || firstDate || prev;
            const d = new Date(base.getFullYear(), base.getMonth() + delta, 1);
            const nextMonth = clampMonth(d);
            const nextStart = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1, 0, 0, 0);
            const nextEnd = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0, 23, 59, 59);
            setFilters((prevFilters) => ({ ...prevFilters, dateStart: nextStart, dateEnd: nextEnd }));
            return nextMonth;
        });
    };

    // Centrar el selector en el mes donde exista al menos un registro cuando
    // no se haya aplicado un filtro de fecha explícito.
    const initializedRef = useRef(false);
    useEffect(() => {
        if (initializedRef.current) return;
        if (!data || data.length === 0) {
            initializedRef.current = true;
            return;
        }

        // Si el usuario ya definió un rango (dateStart), no sobreescribimos.
        if (filters.dateStart) {
            initializedRef.current = true;
            return;
        }

        // Supongamos que `data` viene ordenada por fecha desc; tomar el primero.
        const first = data[0];
        if (!first || !first.fecha_prestamo) {
            initializedRef.current = true;
            return;
        }

        const d = new Date(first.fecha_prestamo + "T00:00:00");
        const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
        setCurrentMonth(start);
        setFilters((prev) => ({ ...prev, dateStart: start, dateEnd: end }));
        initializedRef.current = true;
    }, [data, filters.dateStart]);

    const filteredData = useMemo(() => {
        const persona = filters.persona.trim().toLowerCase();

        return data.filter((item) => {
            const matchPersona = persona ? item.nombre_persona.toLowerCase().includes(persona) : true;
            const matchEstado = filters.estado === "todos" ? true : item.estado === filters.estado;

            if (!matchPersona || !matchEstado) return false;

            if (filters.dateStart) {
                const txDate = new Date(item.fecha_prestamo + "T00:00:00");
                const start = filters.dateStart;
                const end = filters.dateEnd || new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
                if (!txDate || txDate < start || txDate > end) return false;
            }

            return true;
        });
    }, [data, filters]);

    // Mostrar el mes correcto en la cabecera:
    // - Si hay un filtro de fecha explícito (`dateStart`) usarlo.
    // - Si no hay filtro pero existen datos filtrados, centrar en el mes del primer registro.
    // - En otro caso usar `currentMonth`.
    const displayMonth = useMemo(() => {
        if (filters.dateStart) return filters.dateStart;

        if (filteredData && filteredData.length > 0) {
            const first = filteredData[0];
            if (first && first.fecha_prestamo) {
                const d = new Date(first.fecha_prestamo + "T00:00:00");
                return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0);
            }
        }

        return currentMonth;
    }, [filters.dateStart, filteredData, currentMonth]);

    const safeDisplayMonth = useMemo(() => clampMonth(displayMonth), [displayMonth, minAllowedMonth]);

    const totals = useMemo(() => {
        const totalPendiente = filteredData
            .filter((item) => item.estado === "pendiente")
            .reduce((sum, item) => sum + Number(item.monto || 0), 0);

        const totalPagado = filteredData
            .filter((item) => item.estado === "pagado")
            .reduce((sum, item) => sum + Number(item.monto || 0), 0);

        return {
            totalPendiente,
            totalPagado,
            totalGeneral: totalPendiente + totalPagado,
        };
    }, [filteredData]);

    const handleOpenAddModal = () => {
        setActionError(null);
        setModalError("");
        setForm(INITIAL_DEBT_FORM);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        if (submitting) {
            return;
        }
        setModalOpen(false);
        setModalError("");
    };

    const handleFormChange = (field: keyof DebtFormState, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmitModal = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nombre_persona = form.nombre_persona.trim();
        const descripcion = form.descripcion.trim();
        const monto = Number(form.monto);
        const fecha_prestamo = form.fecha_prestamo.trim();

        if (!nombre_persona) {
            setModalError("El nombre de la persona es obligatorio.");
            return;
        }

        if (!Number.isFinite(monto) || monto <= 0) {
            setModalError("Ingresa un monto válido mayor a 0.");
            return;
        }

        if (!fecha_prestamo) {
            setModalError("La fecha del préstamo es obligatoria.");
            return;
        }

        const parsedDate = new Date(`${fecha_prestamo}T00:00:00`);
        if (Number.isNaN(parsedDate.getTime())) {
            setModalError("Ingresa una fecha válida.");
            return;
        }

        setModalError("");
        setActionError(null);
        setSubmitting(true);

        try {
            await addDebtReceivable({
                nombre_persona,
                descripcion,
                monto,
                fecha_prestamo,
                estado: "pendiente",
            });

            setModalOpen(false);
            setForm(INITIAL_DEBT_FORM);
        } catch (err) {
            const message =
                typeof err === "object" && err !== null && "message" in err
                    ? String((err as { message?: string }).message ?? "")
                    : "";
            setModalError(message || "No se pudo agregar la deuda.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleExportPDF = async () => {
        if (filteredData.length === 0) {
            alert("No hay deudas por cobrar para exportar con los filtros aplicados.");
            return;
        }

        const columns = [
            { header: "Fecha préstamo", key: "fecha_prestamo", width: 40 },
            { header: "Persona", key: "nombre_persona", width: 50 },
            { header: "Descripción", key: "descripcion", width: 70 },
            { header: "Monto", key: "monto", width: 30 },
            { header: "Estado", key: "estado", width: 25 },
        ];

        const rows = filteredData.map((item) => ({
            fecha_prestamo: formatDate(item.fecha_prestamo),
            nombre_persona: item.nombre_persona,
            descripcion: item.descripcion || "-",
            monto: item.monto,
            estado: item.estado,
        }));

        const { generatePDF } = await import("../../utils/pdfExport");
        generatePDF("Reporte de Deudas por Cobrar", columns, rows, "reporte-deudas-por-cobrar");
    };

    const handleToggleStatus = async (id: string, currentStatus: DebtReceivableStatus) => {
        setActionError(null);
        setSubmitting(true);

        try {
            await updateDebtStatus(id, currentStatus === "pendiente" ? "pagado" : "pendiente");
        } catch (err) {
            const message =
                typeof err === "object" && err !== null && "message" in err
                    ? String((err as { message?: string }).message ?? "")
                    : "";
            setActionError(message || "No se pudo actualizar el estado.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveDebt = async (id: string) => {
        const confirmed = window.confirm("¿Seguro que deseas eliminar esta deuda por cobrar?");
        if (!confirmed) {
            return;
        }

        setActionError(null);
        setSubmitting(true);

        try {
            await removeDebtReceivable(id);
        } catch (err) {
            const message =
                typeof err === "object" && err !== null && "message" in err
                    ? String((err as { message?: string }).message ?? "")
                    : "";
            setActionError(message || "No se pudo eliminar la deuda.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="main-container relative flex min-h-screen w-full flex-col items-start overflow-x-hidden bg-[#faf8ff] [font-family:'Inter-Regular',Helvetica]">
            <div className="relative min-h-screen w-full overflow-hidden bg-[#faf8ff] [font-family:'Inter-Regular',Helvetica]">
                <DashboardSidebar />

                <main className="relative z-10 min-h-screen w-full lg:ml-[288px] lg:w-[calc(100%-288px)]">
                    <AppTopBar />

                    <section className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h1 className="[font-family:'Manrope-Bold',Helvetica] text-[28px] font-bold leading-[34px] text-[#131b2e] sm:text-[34px] sm:leading-[40px]">
                                    Deudas por cobrar
                                </h1>
                                <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[16px] leading-6 text-[#434654]">
                                    Personas que te deben dinero y su estado de pago.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleOpenAddModal}
                                    disabled={submitting}
                                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#003d9b] px-6 py-3 text-white shadow-[0_8px_10px_0_rgba(0,61,155,0.25)] transition-all duration-200 hover:bg-[#0052cc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003d9b]"
                                >
                                    <span className="[font-family:'Inter-Regular',Helvetica] text-[16px] font-bold leading-6">Agregar deuda</span>
                                </button>
                            </div>
                        </div>

                        {(error || actionError) && (
                            <div className="rounded-2xl border border-[rgba(186,26,26,0.2)] bg-[#fff1f0] px-4 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#ba1a1a]">
                                {actionError || error}
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-3">
                            <article className="rounded-[28px] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                                <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] uppercase tracking-[0.7px] text-[#434654]">
                                    Total pendiente
                                </p>
                                <p className="mt-3 [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#ba1a1a]">
                                    {formatCurrency(totals.totalPendiente)}
                                </p>
                            </article>

                            <article className="rounded-[28px] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                                <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] uppercase tracking-[0.7px] text-[#434654]">
                                    Total pagado
                                </p>
                                <p className="mt-3 [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#006c49]">
                                    {formatCurrency(totals.totalPagado)}
                                </p>
                            </article>

                            <article className="rounded-[28px] bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                                <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] uppercase tracking-[0.7px] text-[#434654]">
                                    Total general
                                </p>
                                <p className="mt-3 [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#131b2e]">
                                    {formatCurrency(totals.totalGeneral)}
                                </p>
                            </article>
                        </div>

                        <div className="overflow-visible rounded-[28px] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                            <div className="relative flex flex-col gap-3 bg-[rgba(242,243,255,0.5)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <h2 className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                    Lista de Deudas por Cobrar
                                </h2>
                                <div className="relative ml-auto flex w-full shrink-0 flex-nowrap items-center justify-end gap-[16px] sm:w-auto">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => changeMonth(-1)}
                                            disabled={Boolean(minAllowedMonth && safeDisplayMonth.getTime() <= minAllowedMonth.getTime())}
                                            className="rounded-full border border-[rgba(195,198,214,0.3)] px-3 py-2 hover:bg-[#f2f3ff] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            &lsaquo;
                                        </button>
                                        <div className="px-3 py-2 rounded-full bg-[#f2f3ff] text-sm font-semibold">
                                            {safeDisplayMonth.toLocaleString("es-PE", { month: "long", year: "numeric" })}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => changeMonth(1)}
                                            className="rounded-full border border-[rgba(195,198,214,0.3)] px-3 py-2 hover:bg-[#f2f3ff]"
                                        >
                                            &rsaquo;
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                                            className="flex gap-[8px] items-center shrink-0 flex-nowrap cursor-pointer transition-opacity hover:opacity-70 ml-2"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[12px] w-[12px] text-[#434654]">
                                                <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            <span className="flex h-[20px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] text-[#434654] text-center whitespace-nowrap">
                                                Filtrar
                                            </span>
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleExportPDF}
                                        className="flex gap-[8px] items-center shrink-0 flex-nowrap cursor-pointer transition-opacity hover:opacity-70"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[12px] w-[12px] text-[#434654]">
                                            <path d="M12 4v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5 19h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className="flex h-[20px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] text-[#434654] text-center whitespace-nowrap">
                                            Exportar
                                        </span>
                                    </button>

                                    {showFilterPanel && (
                                        <div className="absolute right-0 top-full z-[200] mt-2 w-[290px] rounded-2xl border border-[rgba(195,198,214,0.35)] bg-white p-4 shadow-[0_20px_45px_0_rgba(19,27,46,0.14)]">
                                            <div className="flex items-center justify-between">
                                                <p className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.7px] text-[#434654]">
                                                    Filtros
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFilters(INITIAL_FILTERS);
                                                        setShowFilterPanel(false);
                                                    }}
                                                    className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold text-[#0052cc]"
                                                >
                                                    Limpiar
                                                </button>
                                            </div>

                                            <div className="mt-3 grid gap-3">
                                                <label className="flex flex-col gap-1">
                                                    <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold uppercase tracking-[0.6px] text-[#434654]">
                                                        Persona
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={filters.persona}
                                                        onChange={(e) => setFilters((prev) => ({ ...prev, persona: e.target.value }))}
                                                        placeholder="Buscar por nombre"
                                                        className="rounded-full bg-[#f2f3ff] px-4 py-2 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                                                    />
                                                </label>

                                                <label className="flex flex-col gap-1">
                                                    <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold uppercase tracking-[0.6px] text-[#434654]">
                                                        Estado
                                                    </span>
                                                    <select
                                                        value={filters.estado}
                                                        onChange={(e) =>
                                                            setFilters((prev) => ({
                                                                ...prev,
                                                                estado: e.target.value as DebtFiltersState["estado"],
                                                            }))
                                                        }
                                                        className="rounded-full bg-[#f2f3ff] px-4 py-2 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                                                    >
                                                        <option value="todos">Todos</option>
                                                        <option value="pendiente">Pendiente</option>
                                                        <option value="pagado">Pagado</option>
                                                    </select>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr className="border-b border-[rgba(195,198,214,0.25)] bg-[#f7f8ff]">
                                            <th className="px-4 py-4 text-left [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.8px] text-[#434654]">Fecha préstamo</th>
                                            <th className="px-4 py-4 text-left [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.8px] text-[#434654]">Persona</th>
                                            <th className="px-4 py-4 text-left [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.8px] text-[#434654]">Descripción</th>
                                            <th className="px-4 py-4 text-right [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.8px] text-[#434654]">Monto</th>
                                            <th className="px-4 py-4 text-center [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.8px] text-[#434654]">Estado</th>
                                            <th className="px-4 py-4 text-right [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.8px] text-[#434654]">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-8 text-center [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                                    Cargando deudas por cobrar...
                                                </td>
                                            </tr>
                                        )}

                                        {!loading && filteredData.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-10 text-center [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                                    No hay deudas por cobrar para mostrar con los filtros actuales.
                                                </td>
                                            </tr>
                                        )}

                                        {!loading &&
                                            filteredData.map((item) => (
                                                <tr key={item.id} className="border-b border-[rgba(195,198,214,0.12)]">
                                                    <td className="px-4 py-4 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e]">{formatDate(item.fecha_prestamo)}</td>
                                                    <td className="px-4 py-4 [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold text-[#131b2e]">{item.nombre_persona}</td>
                                                    <td className="px-4 py-4 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">{item.descripcion || "-"}</td>
                                                    <td className="px-4 py-4 text-right [font-family:'Manrope-Bold',Helvetica] text-[16px] font-bold text-[#131b2e]">{formatCurrency(item.monto)}</td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={`inline-flex min-w-[90px] items-center justify-center rounded-full px-3 py-1 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] ${getStatusStyles(item.estado)}`}>
                                                            {item.estado}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => void handleToggleStatus(item.id, item.estado)}
                                                                disabled={submitting}
                                                                className="rounded-full border border-[rgba(195,198,214,0.5)] px-3 py-2 [font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold text-[#0052cc] disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {item.estado === "pendiente" ? "Marcar pagado" : "Marcar pendiente"}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => void handleRemoveDebt(item.id)}
                                                                disabled={submitting}
                                                                className="rounded-full border border-[rgba(186,26,26,0.35)] px-3 py-2 [font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold text-[#ba1a1a] disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </section>
                </main>

                <DebtModal
                    open={modalOpen}
                    form={form}
                    error={modalError}
                    submitting={submitting}
                    onClose={handleCloseModal}
                    onChange={handleFormChange}
                    onSubmit={handleSubmitModal}
                />
            </div>
        </div>
    );
};