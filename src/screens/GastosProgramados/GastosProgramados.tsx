import { DashboardSidebar } from "../../components/DashboardSidebar.tsx";

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

export const GastosProgramados = () => {
    return (
        <div className="relative flex w-full min-h-screen flex-col bg-[#faf8ff] overflow-x-hidden [font-family:'Inter-Regular',Helvetica]">
            <DashboardSidebar />

            <main className="relative z-10 min-h-screen w-full lg:ml-[288px] lg:w-[calc(100%-288px)]">
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
                                placeholder="Buscar elementos programados..."
                                className="w-full rounded-full bg-[#f2f3ff] py-[10px] pl-10 pr-4 text-[14px] text-[#6b7280] outline-none"
                            />
                            <div className="pointer-events-none absolute left-3 top-1/2 h-[16px] w-[16px] -translate-y-1/2 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/qt6imbxQcA.png)] bg-cover bg-no-repeat" />
                        </div>
                        <div className="h-8 w-8 rounded-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/omTAhOjgH1.png)] bg-cover bg-no-repeat" />
                        <div className="h-8 w-8 rounded-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/qQ7j07uYtt.png)] bg-cover bg-no-repeat" />
                    </div>
                </header>

                <section className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <h1 className="[font-family:'Manrope-Bold',Helvetica] text-[28px] font-bold leading-[34px] text-[#131b2e] sm:text-[34px] sm:leading-[40px]">
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
                            <div className="flex items-center gap-4 [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold text-[#434654]">
                                <button>Filtrar</button>
                                <button>Exportar</button>
                            </div>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <table className="min-w-[920px] w-full">
                                <thead>
                                    <tr className="border-t border-[rgba(195,198,214,0.1)] text-left">
                                        <th className="px-6 py-4 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Fecha Programada
                                        </th>
                                        <th className="px-6 py-4 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Categoria
                                        </th>
                                        <th className="px-6 py-4 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Descripcion
                                        </th>
                                        <th className="px-6 py-4 [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Monto
                                        </th>
                                        <th className="px-6 py-4 text-right [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold uppercase tracking-[0.6px] text-[#434654]">
                                            Estado
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 bg-[#f2f3ff] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="[font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                Mostrando 5 de 18 gastos programados
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="h-8 w-8 rounded-full text-[#64748b]">&lt;</button>
                                <button className="h-8 w-8 rounded-full bg-[#003d9b] [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold text-white">1</button>
                                <button className="h-8 w-8 rounded-full [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold text-[#64748b]">2</button>
                                <button className="h-8 w-8 rounded-full [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold text-[#64748b]">3</button>
                                <button className="h-8 w-8 rounded-full text-[#64748b]">&gt;</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
