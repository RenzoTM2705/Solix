import { DashboardSidebar } from "../../components/DashboardSidebar.tsx";
import { useTransactions } from "../../hooks/useTransactions";
import { useProfile } from "../../hooks/useProfile";
import { useScheduledTransactions } from "../../hooks/useScheduledTransactions";
import { useMemo } from "react";
import { ProfileMenu } from "../../components/ProfileMenu";

export const Dashboard = () => {
    const { data, loading } = useTransactions();
    const { data: scheduledData, loading: scheduledLoading } = useScheduledTransactions();
    const { profile } = useProfile();

    const formatCurrency = (amount: number, withSign = false) => {
        const value = Math.abs(amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        if (!withSign) {
            return `S/ ${value}`;
        }

        return `${amount >= 0 ? "+" : "-"}S/ ${value}`;
    };

    const {
        montoInicial,
        totalIngresos,
        totalGastos,
        ingresosInstantaneosCount,
        gastosInstantaneosCount,
        gastosProgramadosPendientes,
        gastosProgramadosPagados,
        gastosProgramadosPendientesCount,
        gastosProgramadosPagadosCount,
        balanceOperativo,
        capitalDisponible,
        capitalProyectado,
        categoriasGasto,
        totalGastoChart,
        chartGradient,
        financialHealth,
    } = useMemo(() => {
        const montoInicialValue = Number(profile?.monto_inicial ?? 0);

        const totalIngresosValue = data
            .filter((item) => item.tipo === "ingreso")
            .reduce((sum, item) => sum + Number(item.monto || 0), 0);

        const totalGastosValue = data
            .filter((item) => item.tipo === "gasto")
            .reduce((sum, item) => sum + Number(item.monto || 0), 0);

        const ingresosCount = data.filter((item) => item.tipo === "ingreso").length;
        const gastosCount = data.filter((item) => item.tipo === "gasto").length;

        const scheduledPending = scheduledData
            .filter((item) => item.estado === "pendiente")
            .reduce((sum, item) => sum + Number(item.monto || 0), 0);

        const scheduledPaid = scheduledData
            .filter((item) => item.estado === "pagado")
            .reduce((sum, item) => sum + Number(item.monto || 0), 0);

        const scheduledPendingCount = scheduledData.filter((item) => item.estado === "pendiente").length;
        const scheduledPaidCount = scheduledData.filter((item) => item.estado === "pagado").length;

        const groupedByCategory = [
            ...data.filter((item) => item.tipo === "gasto").map((item) => ({
                categoria: item.categoria,
                monto: Number(item.monto || 0),
            })),
            ...scheduledData.map((item) => ({
                categoria: item.categoria,
                monto: Number(item.monto || 0),
            })),
        ].reduce<Record<string, number>>((acc, item) => {
            const key = item.categoria?.trim() || "Sin categoría";
            acc[key] = (acc[key] ?? 0) + Number(item.monto || 0);
            return acc;
        }, {});

        const palette = ["#003d9b", "#006c49", "#ba1a1a", "#984100", "#7a5af8", "#0ea5e9"];

        const ordered = Object.entries(groupedByCategory)
            .map(([categoria, monto]) => ({ categoria, monto }))
            .sort((a, b) => b.monto - a.monto);

        const chartTotal = ordered.reduce((sum, current) => sum + current.monto, 0);

        const categoriesWithMeta = ordered.map((item, index) => {
            const percentage = chartTotal > 0 ? (item.monto / chartTotal) * 100 : 0;
            return {
                ...item,
                percentage,
                color: palette[index % palette.length],
            };
        });

        const segments = categoriesWithMeta.reduce<{ segments: string[]; accumulated: number }>(
            (acc, item) => {
                const start = acc.accumulated;
                const end = start + item.percentage;
                acc.segments.push(`${item.color} ${start}% ${end}%`);
                return { segments: acc.segments, accumulated: end };
            },
            { segments: [], accumulated: 0 },
        ).segments;

        const gradient =
            segments.length > 0 ? `conic-gradient(${segments.join(",")})` : "conic-gradient(#dbe4ff 0% 100%)";

        const operativo = totalIngresosValue - totalGastosValue;
        const projectedCapital = montoInicialValue + operativo - scheduledPending;

        const highRiskThreshold = montoInicialValue > 0 ? montoInicialValue * 0.25 : 0;
        const mediumRiskThreshold = montoInicialValue > 0 ? montoInicialValue : 0;

        const financialHealth =
            projectedCapital < 0 || (operativo < 0 && projectedCapital <= highRiskThreshold)
                ? {
                    label: "Alto Riesgo",
                    badgeClass: "bg-[#ffe2e0]",
                    textClass: "text-[#b42318]",
                }
                : operativo < 0 || projectedCapital < mediumRiskThreshold
                    ? {
                        label: "Riesgoso",
                        badgeClass: "bg-[#fff4d6]",
                        textClass: "text-[#8a5a00]",
                    }
                    : {
                        label: "Saludable",
                        badgeClass: "bg-[#e2e7ff]",
                        textClass: "text-[#005236]",
                    };

        return {
            montoInicial: montoInicialValue,
            totalIngresos: totalIngresosValue,
            totalGastos: totalGastosValue,
            ingresosInstantaneosCount: ingresosCount,
            gastosInstantaneosCount: gastosCount,
            gastosProgramadosPendientes: scheduledPending,
            gastosProgramadosPagados: scheduledPaid,
            gastosProgramadosPendientesCount: scheduledPendingCount,
            gastosProgramadosPagadosCount: scheduledPaidCount,
            balanceOperativo: operativo,
            capitalDisponible: montoInicialValue + operativo,
            capitalProyectado: projectedCapital,
            categoriasGasto: categoriesWithMeta,
            totalGastoChart: chartTotal,
            chartGradient: gradient,
            financialHealth,
        };
    }, [data, scheduledData, profile?.monto_inicial]);

    return (
        <div className="main-container relative flex w-full min-h-screen pt-0 pr-0 pb-0 pl-0 flex-col items-start flex-nowrap bg-[#faf8ff] overflow-x-hidden [font-family:'Inter-Regular',Helvetica]">
            <div className="relative min-h-screen w-full overflow-hidden bg-[#faf8ff] [font-family:'Inter-Regular',Helvetica]">
                <DashboardSidebar />

                <main className="relative z-10 min-h-screen w-full lg:ml-[288px] lg:w-[calc(100%-288px)]">
                    <header className="flex flex-col gap-3 bg-[rgba(250,248,255,0.8)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/GAUjAjEyGT.png)] bg-cover bg-no-repeat" />
                            <span className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-8 text-[#003d9b]">
                                Solix
                            </span>
                        </div>

                        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4">
                            <div className="relative w-full sm:w-[256px] overflow-hidden rounded-full bg-[#f2f3ff] pl-10 pr-4 py-[10px]">
                                <div className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/X3jXi0uKsm.png)] bg-cover bg-no-repeat" />
                                <span className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-normal leading-[17px] tracking-[-0.35px] text-[#6b7280]">
                                    Buscar...
                                </span>
                            </div>
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                <div className="h-[20px] w-[16px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/4pmBka5dZ8.png)] bg-cover bg-no-repeat" />
                                <div className="absolute right-[7px] top-[8px] h-2 w-2 rounded-full bg-[#ba1a1a]" />
                            </div>
                            <ProfileMenu avatarClassName="h-10 w-10" />
                        </div>
                    </header>

                    <section className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                        {(loading || scheduledLoading) && (
                            <div className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold text-[#434654]">
                                Cargando...
                            </div>
                        )}

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="min-w-0">
                                <h1 className="[font-family:'Manrope-Bold',Helvetica] text-[28px] font-bold leading-[34px] text-[#131b2e] sm:text-[34px] sm:leading-[40px]">
                                    Resumen Ejecutivo
                                </h1>
                                <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[16px] leading-6 text-[#434654]">
                                    Flujo de capital en tiempo real y evaluación de riesgos.
                                </p>
                            </div>
                            <div className={`rounded-full px-4 py-2 ${financialHealth.badgeClass}`}>
                                <span className={`[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[0.6px] ${financialHealth.textClass}`}>
                                    {financialHealth.label}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-[20px] border border-[rgba(0,61,155,0.15)] bg-[rgba(0,61,155,0.04)] px-4 py-3 text-[13px] leading-5 text-[#1d4ed8]">
                            Mostrando ingresos, gastos instantáneos y pagos programados en un mismo resumen.
                        </div>

                        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                            <div className="rounded-[32px] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                                <div className="flex items-start gap-2 min-w-0">
                                    <div className="h-[18px] w-[18px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/AEGAVWW9Xx.png)] bg-cover bg-no-repeat" />
                                    <span className="block min-w-0 [font-family:'Manrope-Bold',Helvetica] text-[20px] sm:text-[20px] font-bold leading-7 sm:leading-7 text-[#131b2e] break-words">
                                        Auditoría de Salud Financiera
                                    </span>
                                </div>

                                <div className="mt-8 space-y-5 border-t border-[#eaedff] pt-6">
                                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[1.2px] text-[#434654]">
                                                Capital inicial
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[#94a3b8]">
                                                Saldo al inicio del periodo
                                            </p>
                                        </div>
                                        <div className="[font-family:'Manrope-Bold',Helvetica] text-[22px] sm:text-[24px] font-bold leading-8 text-[#131b2e] break-words">
                                            {formatCurrency(montoInicial)}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6 border-t border-[#eaedff] pt-5">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[1.2px] text-[#434654]">
                                                Ingresos instantáneos
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[#94a3b8]">
                                                Movimientos registrados al momento
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="[font-family:'Manrope-Bold',Helvetica] text-[22px] sm:text-[24px] font-bold leading-8 text-[#006c49] break-words">
                                                {formatCurrency(totalIngresos, true)}
                                            </div>
                                            <div className="text-[11px] text-[#64748b]">{ingresosInstantaneosCount} registro(s)</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6 border-t border-[#eaedff] pt-5">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[1.2px] text-[#434654]">
                                                Gastos instantáneos
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[#94a3b8]">
                                                Salidas registradas al momento
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="[font-family:'Manrope-Bold',Helvetica] text-[22px] sm:text-[24px] font-bold leading-8 text-[#ba1a1a] break-words">
                                                {formatCurrency(-totalGastos, true)}
                                            </div>
                                            <div className="text-[11px] text-[#64748b]">{gastosInstantaneosCount} registro(s)</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6 border-t border-[#eaedff] pt-5">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[1.2px] text-[#434654]">
                                                Por pagar programado
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[#94a3b8]">
                                                Pagos pendientes futuros
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="[font-family:'Manrope-Bold',Helvetica] text-[22px] sm:text-[24px] font-bold leading-8 text-[#ba1a1a] break-words">
                                                {formatCurrency(-gastosProgramadosPendientes, true)}
                                            </div>
                                            <div className="text-[11px] text-[#64748b]">{gastosProgramadosPendientesCount} programado(s)</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6 border-t border-[#eaedff] pt-5">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[1.2px] text-[#434654]">
                                                Programado pagado
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[#94a3b8]">
                                                Pagos programados ya completados
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="[font-family:'Manrope-Bold',Helvetica] text-[22px] sm:text-[24px] font-bold leading-8 text-[#006c49] break-words">
                                                {formatCurrency(-gastosProgramadosPagados, true)}
                                            </div>
                                            <div className="text-[11px] text-[#64748b]">{gastosProgramadosPagadosCount} programado(s)</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 rounded-[32px] bg-[rgba(0,61,155,0.05)] px-5 py-5 sm:px-6 sm:py-6 border border-[rgba(255,255,255,0.5)]">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-bold uppercase tracking-[1.2px] text-[#003d9b]">
                                                Capital disponible actual
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[rgba(29,78,216,0.6)]">
                                                Capital inicial + balance operativo
                                            </p>
                                        </div>
                                        <div className="[font-family:'Manrope-Bold',Helvetica] text-[30px] sm:text-[30px] font-bold leading-9 text-[#003d9b] break-words">
                                            {formatCurrency(capitalDisponible)}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6 rounded-[32px] bg-[rgba(186,26,26,0.06)] px-5 py-5 sm:px-6 sm:py-6 border border-[rgba(255,255,255,0.5)]">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-bold uppercase tracking-[1.2px] text-[#ba1a1a]">
                                                Capital proyectado
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[rgba(185,28,28,0.7)]">
                                                Capital disponible - por pagar programado
                                            </p>
                                        </div>
                                        <div className="[font-family:'Manrope-Bold',Helvetica] text-[30px] sm:text-[30px] font-bold leading-9 text-[#ba1a1a] break-words">
                                            {formatCurrency(capitalProyectado)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[32px] bg-white p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                                <div className="flex items-start justify-between gap-4">
                                    <span className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                        Desglose de Gastos
                                    </span>
                                    <span className="[font-family:'Inter-SemiBold',Helvetica] text-[14px] font-bold leading-5 text-[#003d9b]">
                                        {categoriasGasto.length}
                                    </span>
                                </div>

                                <div className="mt-8 flex flex-col items-center justify-center gap-6 rounded-[32px] bg-[#f8faff] p-4 sm:p-6 md:flex-row md:items-center md:justify-start md:gap-8 lg:gap-10 lg:p-8 overflow-hidden">
                                    <div className="relative flex h-40 w-40 shrink-0 items-center justify-center sm:h-48 sm:w-48">
                                        <div className="absolute inset-0 rounded-full" style={{ background: chartGradient }} />
                                        <div className="absolute inset-5 rounded-full bg-[#faf8ff]" />
                                        <div className="relative z-10 text-center">
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[30px] font-bold leading-9 text-[#131b2e]">
                                                {Math.round(totalGastoChart).toLocaleString("en-US")}
                                            </div>
                                            <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#434654]">
                                                Gastos tot.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full min-w-0 space-y-4 md:w-auto md:flex-1">
                                        {categoriasGasto.length === 0 ? (
                                            <p className="text-[12px] text-[#434654]">No hay gastos registrados.</p>
                                        ) : (
                                            categoriasGasto.map((item) => (
                                                <div key={item.categoria} className="flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="[font-family:'Inter-SemiBold',Helvetica] text-[14px] font-bold text-[#131b2e] truncate">
                                                            {item.categoria}
                                                        </div>
                                                        <div className="text-[12px] text-[#434654]">
                                                            {item.percentage.toFixed(1)}% • {formatCurrency(item.monto)}
                                                        </div>
                                                    </div>
                                                    <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4 rounded-[32px] bg-[#f2f3ff] p-5 border border-[rgba(255,255,255,0.5)]">
                                    <div className="flex items-center gap-2">
                                        <div className="h-[7px] w-[11.667px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/sEtP0HEFDG.png)] bg-cover bg-no-repeat" />
                                        <span className="[font-family:'Inter-SemiBold',Helvetica] text-[10px] font-bold uppercase tracking-[1px] text-[#006c49]">
                                            Balance operativo
                                        </span>
                                    </div>
                                    <div className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                        {formatCurrency(balanceOperativo, true)}
                                    </div>
                                    <p className="text-[10px] leading-[15px] text-[#434654]">
                                        Resultado mensual de ingresos menos gastos.
                                    </p>
                                </div>

                                <div className="mt-4 space-y-4 rounded-[32px] bg-[#f2f3ff] p-5 border border-[rgba(255,255,255,0.5)]">
                                    <div className="flex items-center gap-2">
                                        <div className="h-[11.667px] w-[9.333px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/cR2vHwC5ha.png)] bg-cover bg-no-repeat" />
                                        <span className="[font-family:'Inter-SemiBold',Helvetica] text-[10px] font-bold uppercase tracking-[1px] text-[#ba1a1a]">
                                            Carga de gastos
                                        </span>
                                    </div>
                                    <div className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                        {totalIngresos > 0 ? `${((totalGastos / totalIngresos) * 100).toFixed(1)}%` : "0.0%"}
                                    </div>
                                    <p className="text-[10px] leading-[15px] text-[#434654]">
                                        Proporción de gastos frente a ingresos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};