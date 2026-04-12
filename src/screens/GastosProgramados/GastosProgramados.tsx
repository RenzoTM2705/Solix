import { DashboardSidebar } from "../../components/DashboardSidebar.tsx";
import { AppTopBar } from "../../components/AppTopBar";
import { useScheduledTransactions } from "../../hooks/useScheduledTransactions";
import { getAuthErrorMessage } from "../../services/auth.service";
import type { ScheduledTransaction } from "../../types/scheduledTransaction";
import { useEffect, useMemo, useState } from "react";

const formatCurrency = (value: number, withSign = false) => {
    const abs = Math.abs(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    if (!withSign) {
        return `S/ ${abs}`;
    }

    const prefix = value >= 0 ? "+" : "-";
    return `${prefix}S/ ${abs}`;
};

const formatDate = (value: string) => {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatSignedAmount = (value: number) => {
    return `-S/ ${Math.abs(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const getStateStyles = (estado: string) => {
    if (estado === "pagado") {
        return {
            label: "Pagados",
            badge: "text-[#00714d] bg-[#6cf8bb]",
            amount: "text-[#006c49]",
        };
    }

    return {
        label: "Por pagar",
        badge: "text-[#93000a] bg-[#ffdad6]",
        amount: "text-[#ba1a1a]",
    };
};

type ScheduledExpenseForm = {
    descripcion: string;
    monto: string;
    categoria: string;
    fecha_programada: string;
    estado: "pendiente" | "pagado";
};

const INITIAL_FORM: ScheduledExpenseForm = {
    descripcion: "",
    monto: "",
    categoria: "",
    fecha_programada: new Date().toISOString().slice(0, 10),
    estado: "pendiente",
};

const notifyAction = (message: string) => {
    const payload = { message, timestamp: Date.now() };
    sessionStorage.setItem("solix:last_action", JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("solix:action", { detail: payload }));
};

const ScheduledExpenseModal = ({
    open,
    form,
    error,
    submitting,
    onClose,
    onChange,
    onSubmit,
    onDelete,
    mode,
}: {
    open: boolean;
    form: ScheduledExpenseForm;
    error: string;
    submitting: boolean;
    onClose: () => void;
    onChange: (field: keyof ScheduledExpenseForm, value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onDelete?: () => void;
    mode: "add" | "edit";
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
                        {mode === "add" ? "Agregar Gasto Programado" : "Editar Gasto Programado"}
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
                            Categoría
                        </span>
                        <input
                            type="text"
                            value={form.categoria}
                            onChange={(e) => onChange("categoria", e.target.value)}
                            className="rounded-full bg-[#f2f3ff] px-5 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                            Fecha programada
                        </span>
                        <input
                            type="date"
                            value={form.fecha_programada}
                            onChange={(e) => onChange("fecha_programada", e.target.value)}
                            className="rounded-full bg-[#f2f3ff] px-5 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                            Estado
                        </span>
                        <select
                            value={form.estado}
                            onChange={(e) => onChange("estado", e.target.value)}
                            className="rounded-full bg-[#f2f3ff] px-5 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                        </select>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    {mode === "edit" && onDelete && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="mr-auto rounded-full border border-[rgba(186,26,26,0.25)] px-5 py-2 [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold text-[#ba1a1a] hover:bg-[#fff0ef]"
                        >
                            Eliminar
                        </button>
                    )}
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

export const GastosProgramados = () => {
    const {
        data,
        loading,
        error,
        addScheduledTransaction,
        updateScheduledTransaction,
        removeScheduledTransaction,
    } = useScheduledTransactions();
    const [actionError, setActionError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [activeItem, setActiveItem] = useState<ScheduledTransaction | null>(null);
    const [form, setForm] = useState<ScheduledExpenseForm>(INITIAL_FORM);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    const totals = useMemo(() => {
        const now = new Date();
        const limit = new Date(now);
        limit.setDate(limit.getDate() + 30);

        const pendingItems = data.filter((item) => item.estado === "pendiente");
        const paidItems = data.filter((item) => item.estado === "pagado");
        const upcomingItems = pendingItems.filter((item) => {
            const parsed = new Date(item.fecha_programada);
            return !Number.isNaN(parsed.getTime()) && parsed >= now && parsed <= limit;
        });

        return {
            upcomingTotal: upcomingItems.reduce((sum, item) => sum + Number(item.monto || 0), 0),
            upcomingCount: upcomingItems.length,
            activeTotal: pendingItems.reduce((sum, item) => sum + Number(item.monto || 0), 0),
            activeCount: pendingItems.length,
            inactiveTotal: paidItems.reduce((sum, item) => sum + Number(item.monto || 0), 0),
            inactiveCount: paidItems.length,
        };
    }, [data]);

    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [currentPage, data]);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }, [totalPages]);

    const handleAddScheduledTransaction = async () => {
        setActionError("");
        setModalMode("add");
        setActiveItem(null);
        setForm(INITIAL_FORM);
        setModalOpen(true);
    };

    const handleOpenEditModal = (item: ScheduledTransaction) => {
        setActionError("");
        setModalMode("edit");
        setActiveItem(item);
        setForm({
            descripcion: item.descripcion,
            monto: String(item.monto),
            categoria: item.categoria,
            fecha_programada: item.fecha_programada.slice(0, 10),
            estado: item.estado,
        });
        setModalOpen(true);
    };

    const handleFormChange = (field: keyof ScheduledExpenseForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCloseModal = () => {
        if (submittingForm) {
            return;
        }

        setModalOpen(false);
        setActiveItem(null);
        setForm(INITIAL_FORM);
    };

    const handleSubmitModal = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setActionError("");

        const descripcion = form.descripcion.trim();
        const categoria = form.categoria.trim();
        const monto = Number(form.monto);

        if (!descripcion || !categoria) {
            setActionError("Nombre y categoría son obligatorios.");
            return;
        }

        if (!Number.isFinite(monto) || monto <= 0) {
            setActionError("El monto debe ser un número mayor que 0.");
            return;
        }

        if (!form.fecha_programada) {
            setActionError("La fecha de próxima ejecución es obligatoria.");
            return;
        }

        setSubmittingForm(true);

        try {
            if (modalMode === "edit" && activeItem) {
                await updateScheduledTransaction(activeItem.id, {
                    descripcion,
                    monto,
                    categoria,
                    fecha_programada: new Date(form.fecha_programada).toISOString(),
                    estado: form.estado,
                });
                notifyAction(
                    form.estado === "pagado"
                        ? "Pago programado marcado como completado."
                        : "Gasto programado actualizado correctamente.",
                );
            } else if (modalMode === "add") {
                await addScheduledTransaction({
                    descripcion,
                    monto,
                    categoria,
                    fecha_programada: new Date(form.fecha_programada).toISOString(),
                });
                notifyAction("Gasto programado agregado correctamente.");
            }

            setModalOpen(false);
            setActiveItem(null);
            setForm(INITIAL_FORM);
            setCurrentPage(1);
        } catch (err) {
            setActionError(getAuthErrorMessage(err));
        } finally {
            setSubmittingForm(false);
        }
    };

    const handleDeleteFromModal = async () => {
        if (!activeItem) {
            return;
        }

        const confirmed = window.confirm(`¿Eliminar el gasto programado "${activeItem.descripcion}"?`);
        if (!confirmed) {
            return;
        }

        setActionError("");
        setSubmittingForm(true);

        try {
            await removeScheduledTransaction(activeItem.id);
            notifyAction("Gasto programado eliminado correctamente.");
            setModalOpen(false);
            setActiveItem(null);
            setForm(INITIAL_FORM);
            setCurrentPage(1);
        } catch (err) {
            setActionError(getAuthErrorMessage(err));
        } finally {
            setSubmittingForm(false);
        }
    };

    useEffect(() => {
        const pageTitle = "Gastos Programados | Solix";
        const pageDescription =
            "Administre gastos programados, pagos recurrentes y proximos compromisos financieros desde Solix.";
        const pageUrl =
            typeof window !== "undefined"
                ? `${window.location.origin}/gastos-programados`
                : "/gastos-programados";

        document.title = pageTitle;

        const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
            let tag = document.querySelector(`meta[${attr}='${key}']`) as HTMLMetaElement | null;
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute(attr, key);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        const upsertCanonical = (href: string) => {
            let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement("link");
                link.setAttribute("rel", "canonical");
                document.head.appendChild(link);
            }
            link.setAttribute("href", href);
        };

        upsertMeta("name", "description", pageDescription);
        upsertMeta("name", "robots", "index, follow");
        upsertMeta("property", "og:title", pageTitle);
        upsertMeta("property", "og:description", pageDescription);
        upsertMeta("property", "og:type", "website");
        upsertMeta("property", "og:url", pageUrl);
        upsertMeta("name", "twitter:card", "summary");
        upsertMeta("name", "twitter:title", pageTitle);
        upsertMeta("name", "twitter:description", pageDescription);
        upsertCanonical(pageUrl);
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Gastos Programados | Solix",
        description:
            "Vista para administrar pagos recurrentes y compromisos financieros programados en Solix.",
        url: typeof window !== "undefined" ? `${window.location.origin}/gastos-programados` : "/gastos-programados",
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Dashboard",
                    item: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard",
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Gastos Programados",
                    item:
                        typeof window !== "undefined"
                            ? `${window.location.origin}/gastos-programados`
                            : "/gastos-programados",
                },
            ],
        },
    };

    return (
        <div className="relative flex w-full min-h-screen flex-col bg-[#faf8ff] overflow-x-hidden [font-family:'Inter-Regular',Helvetica]">
            <DashboardSidebar />

            <main
                className="relative z-10 min-h-screen w-full lg:ml-[288px] lg:w-[calc(100%-288px)]"
                aria-labelledby="gastos-programados-title"
            >
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
                <AppTopBar />

                <section className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <h1
                                id="gastos-programados-title"
                                className="[font-family:'Manrope-Bold',Helvetica] text-[28px] font-bold leading-[34px] text-[#131b2e] sm:text-[34px] sm:leading-[40px]"
                            >
                                Gastos Programados
                            </h1>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[16px] leading-6 text-[#434654]">
                                Administre sus gastos programados desde un flujo conectado a Supabase.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddScheduledTransaction}
                            disabled={submittingForm}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#003d9b] px-6 py-3 text-white shadow-[0_8px_10px_0_rgba(0,61,155,0.25)] disabled:opacity-60"
                        >
                            <span className="[font-family:'Inter-Regular',Helvetica] text-[16px] font-bold leading-6">
                                Agregar gasto programado
                            </span>
                        </button>
                    </div>

                    {(error || actionError) && (
                        <p className="[font-family:'Inter-Regular',Helvetica] text-sm text-[#dc2626]">
                            {actionError || error}
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <article className="rounded-[32px] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                            <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-bold uppercase tracking-[1.2px] text-[#006c49]">
                                Próximos 30 días
                            </p>
                            <p className="mt-3 [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#131b2e]">
                                {formatSignedAmount(totals.upcomingTotal)}
                            </p>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                {totals.upcomingCount} por vencer
                            </p>
                        </article>

                        <article className="rounded-[32px] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] border-l-4 border-[#ba1a1a]">
                            <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-bold uppercase tracking-[1.2px] text-[#ba1a1a]">
                                Por pagar
                            </p>
                            <p className="mt-3 [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#ba1a1a]">
                                {formatSignedAmount(totals.activeTotal)}
                            </p>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                {totals.activeCount} pagos pendientes
                            </p>
                        </article>

                        <article className="rounded-[32px] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] border-l-4 border-[#006c49]">
                            <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-bold uppercase tracking-[1.2px] text-[#006c49]">
                                Pagados
                            </p>
                            <p className="mt-3 [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#006c49]">
                                {formatSignedAmount(totals.inactiveTotal)}
                            </p>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                {totals.inactiveCount} pagos completados
                            </p>
                        </article>
                    </div>

                    <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col gap-3 bg-[rgba(242,243,255,0.5)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <h2 className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                Lista de Gastos Programados
                            </h2>
                            <div className="flex w-[149.693px] gap-[16px] items-start shrink-0 flex-nowrap relative z-[93]">
                                <div className="flex w-[58.23px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[94]">
                                    <div className="flex w-[10.5px] flex-col items-center shrink-0 flex-nowrap relative z-[95]">
                                        <div className="w-[10.5px] h-[7px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/VJYcxW5iNX.png)] bg-cover bg-no-repeat relative z-[96]" />
                                    </div>
                                    <span className="flex w-[39.73px] h-[20px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] text-[#434654] relative text-center whitespace-nowrap z-[97]">
                                        Filtrar
                                    </span>
                                </div>
                                <div className="flex w-[75.463px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[98]">
                                    <div className="flex w-[9.333px] flex-col items-center shrink-0 flex-nowrap relative z-[99]">
                                        <div className="w-[9.333px] h-[9.333px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/rGTigOR2Nd.png)] bg-cover bg-no-repeat relative z-[100]" />
                                    </div>
                                    <span className="flex w-[58.13px] h-[20px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] text-[#434654] relative text-center whitespace-nowrap z-[101]">
                                        Exportar
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <table className="min-w-[1100px] w-full">
                                <caption className="sr-only">
                                    Lista de gastos programados con fecha, categoria, descripcion, monto y estado
                                </caption>
                                <thead>
                                    <tr className="border-t border-[rgba(195,198,214,0.1)] text-left">
                                        <th scope="col" className="px-6 py-4 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Fecha Programada
                                        </th>
                                        <th scope="col" className="px-6 py-4 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Categoria
                                        </th>
                                        <th scope="col" className="px-6 py-4 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Descripcion
                                        </th>
                                        <th scope="col" className="px-6 py-4 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Monto
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr className="border-b border-[rgba(195,198,214,0.1)]">
                                            <td colSpan={5} className="px-6 py-8 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                                Cargando...
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr className="border-b border-[rgba(195,198,214,0.1)]">
                                            <td colSpan={5} className="px-6 py-8 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                                Aún no tienes gastos programados registrados.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((item) => {
                                            const stateStyles = getStateStyles(item.estado);

                                            return (
                                                <tr key={item.id} className="border-b border-[rgba(195,198,214,0.1)]">
                                                    <td className="px-6 py-4">
                                                        <p className="[font-family:'Inter-Regular',Helvetica] text-[16px] font-semibold text-[#131b2e]">
                                                            {formatDate(item.fecha_programada)}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex rounded-full bg-[#e2e7ff] px-3 py-1 [font-family:'Inter-Regular',Helvetica] text-[14px] font-medium text-[#131b2e]">
                                                            {item.categoria}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 [font-family:'Inter-Regular',Helvetica] text-[15px] font-medium text-[#131b2e]">
                                                        {item.descripcion}
                                                    </td>
                                                    <td className={`px-6 py-4 [font-family:'Manrope-Bold',Helvetica] text-[18px] font-bold ${stateStyles.amount}`}>
                                                        {item.estado === "pagado" ? `+${formatCurrency(item.monto)}` : formatSignedAmount(item.monto)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex flex-col items-end gap-2">
                                                            <span className={`inline-flex rounded-full px-4 py-1 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] ${stateStyles.badge}`}>
                                                                {stateStyles.label}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEditModal(item)}
                                                                className="inline-flex items-center justify-center rounded-full border border-[#c3c6d64d] px-4 py-2 [font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold leading-4 text-[#0052cc] transition-all duration-200 hover:bg-[#f2f3ff]"
                                                            >
                                                                Editar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 bg-[#f2f3ff] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                Mostrando {paginatedData.length} de {data.length} gastos programados
                            </p>
                            <div className="flex w-full sm:w-[232px] gap-[8px] items-start justify-center sm:justify-start shrink-0 flex-nowrap relative z-[182]">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[183] hover:bg-[#f2f3ff] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <div className="flex w-[7.4px] flex-col items-center shrink-0 flex-nowrap relative z-[184]">
                                        <div className="w-[7.4px] h-[12px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/ySHF1wAAtB.png)] bg-cover bg-no-repeat relative z-[185]" />
                                    </div>
                                </button>
                                {pageNumbers.map((pageNumber) => {
                                    const isActive = pageNumber === currentPage;

                                    return (
                                        <button
                                            key={pageNumber}
                                            type="button"
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border relative transition-all duration-200 ${
                                                isActive
                                                    ? "bg-[#0052cc] border-[#0052cc]"
                                                    : "border-[rgba(195,198,214,0.3)] hover:bg-[#f2f3ff]"
                                            }`}
                                        >
                                            <span className={`flex h-[24px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[16px] font-bold leading-[24px] relative text-center whitespace-nowrap ${
                                                isActive ? "text-[#fff]" : "text-[#434654]"
                                            }`}>
                                                {pageNumber}
                                            </span>
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[192] hover:bg-[#f2f3ff] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <div className="flex w-[7.4px] flex-col items-center shrink-0 flex-nowrap relative z-[193]">
                                        <div className="w-[7.4px] h-[12px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/1RJYiJee7R.png)] bg-cover bg-no-repeat relative z-[194]" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ScheduledExpenseModal
                open={modalOpen}
                form={form}
                error={actionError}
                submitting={submittingForm}
                onClose={handleCloseModal}
                onChange={handleFormChange}
                onSubmit={handleSubmitModal}
                onDelete={handleDeleteFromModal}
                mode={modalMode}
            />
        </div>
    );
};
