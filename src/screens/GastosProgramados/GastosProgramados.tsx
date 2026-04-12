import { DashboardSidebar } from "../../components/DashboardSidebar.tsx";
import { useEffect, useState } from "react";

const upcomingPayments = [
    {
        fecha: "15 Oct, 2023",
        frecuencia: "Mensual",
        categoria: "Vivienda",
        descripcion: "Pago de Renta - Apartamento 4B",
        monto: "S/1,200.00",
        estado: "Pendiente",
        estadoColor: "text-[#93000a] bg-[#ffdad6]",
    },
    {
        fecha: "12 Oct, 2023",
        frecuencia: "Mensual",
        categoria: "Servicios",
        descripcion: "Factura de Electricidad",
        monto: "S/85.50",
        estado: "Pagado",
        estadoColor: "text-[#00714d] bg-[#6cf8bb]",
    },
    {
        fecha: "18 Oct, 2023",
        frecuencia: "Anual",
        categoria: "Seguros",
        descripcion: "Seguro de Gastos Medicos",
        monto: "S/2,400.00",
        estado: "Pendiente",
        estadoColor: "text-[#93000a] bg-[#ffdad6]",
    },
    {
        fecha: "10 Oct, 2023",
        frecuencia: "Mensual",
        categoria: "Entretenimiento",
        descripcion: "Suscripcion Streaming Premium",
        monto: "S/15.99",
        estado: "Pagado",
        estadoColor: "text-[#00714d] bg-[#6cf8bb]",
    },
    {
        fecha: "22 Oct, 2023",
        frecuencia: "Unica vez",
        categoria: "Transporte",
        descripcion: "Mantenimiento Preventivo Auto",
        monto: "S/350.00",
        estado: "Pendiente",
        estadoColor: "text-[#93000a] bg-[#ffdad6]",
    },
];

type UpcomingPayment = (typeof upcomingPayments)[number];

type ScheduledExpenseForm = {
    fecha: string;
    frecuencia: string;
    categoria: string;
    descripcion: string;
    monto: string;
    estado: string;
};

const ScheduledExpenseModal = ({
    open,
    form,
    onClose,
    onChange,
}: {
    open: boolean;
    form: ScheduledExpenseForm;
    onClose: () => void;
    onChange: (field: keyof ScheduledExpenseForm, value: string) => void;
}) => {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-[rgba(19,27,46,0.45)] px-4">
            <div className="w-full max-w-[520px] rounded-[32px] border border-[rgba(195,198,214,0.2)] bg-white p-6 shadow-[0_30px_60px_0_rgba(19,27,46,0.18)] sm:p-8">
                <div className="mb-5 flex items-center justify-between">
                    <h3 className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-[32px] text-[#131b2e]">
                        Editar Gasto Programado
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 [font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold text-[#434654] hover:bg-[#f2f3ff]"
                    >
                        Cerrar
                    </button>
                </div>

                <p className="mb-4 [font-family:'Inter-Regular',Helvetica] text-[13px] text-[#434654]">
                    Esta modal es visual por ahora. La persistencia se habilitará cuando se implemente el módulo.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <label className="flex flex-col gap-2">
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                            Fecha
                        </span>
                        <input
                            type="text"
                            value={form.fecha}
                            onChange={(e) => onChange("fecha", e.target.value)}
                            className="rounded-full bg-[#f2f3ff] px-5 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                            Frecuencia
                        </span>
                        <input
                            type="text"
                            value={form.frecuencia}
                            onChange={(e) => onChange("frecuencia", e.target.value)}
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
                            type="text"
                            value={form.monto}
                            onChange={(e) => onChange("monto", e.target.value)}
                            className="rounded-full bg-[#f2f3ff] px-5 py-3 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#131b2e] outline-none"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                            Estado
                        </span>
                        <input
                            type="text"
                            value={form.estado}
                            onChange={(e) => onChange("estado", e.target.value)}
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
                        type="button"
                        disabled
                        className="rounded-full bg-[#003d9b] px-5 py-2 [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold text-white opacity-60"
                    >
                        Guardar (próximamente)
                    </button>
                </div>
            </div>
        </div>
    );
};

export const GastosProgramados = () => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [scheduledForm, setScheduledForm] = useState<ScheduledExpenseForm>({
        fecha: "",
        frecuencia: "",
        categoria: "",
        descripcion: "",
        monto: "",
        estado: "",
    });

    const handleOpenEditModal = (item: UpcomingPayment) => {
        setScheduledForm({
            fecha: item.fecha,
            frecuencia: item.frecuencia,
            categoria: item.categoria,
            descripcion: item.descripcion,
            monto: item.monto,
            estado: item.estado,
        });
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };

    const handleScheduledChange = (field: keyof ScheduledExpenseForm, value: string) => {
        setScheduledForm((prev) => ({
            ...prev,
            [field]: value,
        }));
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

            <main className="relative z-10 min-h-screen w-full lg:ml-[288px] lg:w-[calc(100%-288px)]" aria-labelledby="gastos-programados-title">
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
                <header className="flex flex-col gap-3 bg-[rgba(250,248,255,0.8)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/kMiBtgf6O5.png)] bg-cover bg-no-repeat" />
                        <span className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-8 text-[#003d9b]">
                            Solix
                        </span>
                    </div>

                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <div className="relative w-full sm:w-[280px]">
                            <input
                                type="text"
                                aria-label="Buscar elementos programados"
                                placeholder="Buscar elementos programados..."
                                className="w-full rounded-full bg-[#f2f3ff] py-[10px] pl-10 pr-4 text-[14px] text-[#6b7280] outline-none"
                            />
                            <div className="pointer-events-none absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/qt6imbxQcA.png)] bg-cover bg-no-repeat" />
                        </div>
                        <div className="flex w-[32px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col justify-center items-center shrink-0 flex-nowrap rounded-full relative z-[61]"><div className="flex w-[16px] justify-center items-start shrink-0 flex-nowrap relative z-[62]"><div className="w-[16px] h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/AfdAwGr5cL.png)] bg-cover bg-no-repeat relative z-[63]"></div></div></div>
                        <div className="flex w-[32px] h-[32px] flex-col items-start shrink-0 flex-nowrap bg-[rgba(255,255,255,0)] rounded-full border-2 border-[rgba(0,82,204,0.2)] relative overflow-hidden shadow-[0_0_0_0_#dae2ff] z-[64]">
                            <div className="w-[32px] h-[32px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/GtEyW4VDxX.png)] bg-cover bg-no-repeat relative overflow-hidden z-[65]" />
                        </div>
                    </div>
                </header>

                <section className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <h1 id="gastos-programados-title" className="[font-family:'Manrope-Bold',Helvetica] text-[28px] font-bold leading-[34px] text-[#131b2e] sm:text-[34px] sm:leading-[40px]">
                                Gastos Programados
                            </h1>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[16px] leading-6 text-[#434654]">
                                Administre sus pagos recurrentes y proximos compromisos financieros.
                            </p>
                        </div>

                        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#003d9b] px-6 py-3 text-white shadow-[0_8px_10px_0_rgba(0,61,155,0.25)]">
                            <span className="[font-family:'Inter-Regular',Helvetica] text-[16px] font-bold leading-6">
                                Programar Gasto
                            </span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <article className="rounded-[32px] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                            <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-bold uppercase tracking-[1.2px] text-[#006c49]">
                                Proximos 30 dias
                            </p>
                            <p className="mt-3 [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#131b2e]">
                                S/4,250.00
                            </p>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                12 pagos pendientes
                            </p>
                        </article>

                        <article className="rounded-[32px] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                            <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-bold uppercase tracking-[1.2px] text-[#003d9b]">
                                Pagado este mes
                            </p>
                            <p className="mt-3 [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#131b2e]">
                                S/1,890.00
                            </p>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                5 pagos procesados
                            </p>
                        </article>

                        <article className="rounded-[32px] border-l-4 border-[#ba1a1a] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                            <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-bold uppercase tracking-[1.2px] text-[#ba1a1a]">
                                Vencidos
                            </p>
                            <p className="mt-3 [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#131b2e]">
                                S/120.00
                            </p>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                2 acciones requeridas
                            </p>
                        </article>
                    </div>

                    <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col gap-3 bg-[rgba(242,243,255,0.5)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <h2 className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                Actividad Reciente
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
                            <table className="min-w-[920px] w-full">
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
                                        <th scope="col" className="px-6 py-4 text-right [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingPayments.map((item) => (
                                        <tr key={`${item.fecha}-${item.descripcion}`} className="border-b border-[rgba(195,198,214,0.1)]">
                                            <td className="px-6 py-4">
                                                <p className="[font-family:'Inter-Regular',Helvetica] text-[16px] font-semibold text-[#131b2e]">
                                                    {item.fecha}
                                                </p>
                                                <p className="[font-family:'Inter-Regular',Helvetica] text-[12px] text-[#434654]">
                                                    {item.frecuencia}
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
                                            <td className="px-6 py-4 [font-family:'Manrope-Bold',Helvetica] text-[18px] font-bold text-[#131b2e]">
                                                {item.monto}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex rounded-full px-4 py-1 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] ${item.estadoColor}`}>
                                                    {item.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditModal(item)}
                                                    className="inline-flex items-center justify-center rounded-full border border-[#c3c6d64d] px-4 py-2 [font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold leading-4 text-[#0052cc] transition-all duration-200 hover:bg-[#f2f3ff]"
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 bg-[#f2f3ff] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                Mostrando 5 de 18 gastos programados
                            </p>
                            <div className="flex w-full sm:w-[232px] gap-[8px] items-start justify-center sm:justify-start shrink-0 flex-nowrap relative z-[182]">
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[183]">
                                    <div className="flex w-[7.4px] flex-col items-center shrink-0 flex-nowrap relative z-[184]">
                                        <div className="w-[7.4px] h-[12px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/ySHF1wAAtB.png)] bg-cover bg-no-repeat relative z-[185]" />
                                    </div>
                                </div>
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap bg-[#0052cc] rounded-full relative z-[186]">
                                    <span className="flex w-[6.91px] h-[24px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[16px] font-bold leading-[24px] text-[#fff] relative text-center whitespace-nowrap z-[187]">
                                        1
                                    </span>
                                </div>
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[188]">
                                    <span className="flex w-[9.77px] h-[24px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[16px] font-normal leading-[24px] text-[#434654] relative text-center whitespace-nowrap z-[189]">
                                        2
                                    </span>
                                </div>
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[190]">
                                    <span className="flex w-[9.89px] h-[24px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[16px] font-normal leading-[24px] text-[#434654] relative text-center whitespace-nowrap z-[191]">
                                        3
                                    </span>
                                </div>
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[192]">
                                    <div className="flex w-[7.4px] flex-col items-center shrink-0 flex-nowrap relative z-[193]">
                                        <div className="w-[7.4px] h-[12px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/1RJYiJee7R.png)] bg-cover bg-no-repeat relative z-[194]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ScheduledExpenseModal
                open={editModalOpen}
                form={scheduledForm}
                onClose={handleCloseEditModal}
                onChange={handleScheduledChange}
            />
        </div>
    );
};
