import { DashboardSidebar } from "../../components/DashboardSidebar.tsx";

export const Dashboard = () => {
    return (
        <div className="main-container relative flex w-full min-h-screen pt-0 pr-0 pb-0 pl-0 flex-col items-start flex-nowrap bg-[#faf8ff] overflow-hidden [font-family:'Inter-Regular',Helvetica]">
            <div className="relative min-h-screen w-full overflow-hidden bg-[#faf8ff] [font-family:'Inter-Regular',Helvetica]">
                <DashboardSidebar />

                <main className="relative z-10 ml-[288px] min-h-screen w-[calc(100%-288px)]">
                    <header className="flex items-center justify-between bg-[rgba(250,248,255,0.8)] px-8 py-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/GAUjAjEyGT.png)] bg-cover bg-no-repeat" />
                            <span className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-8 text-[#003d9b]">
                                Solix
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative w-[256px] overflow-hidden rounded-full bg-[#f2f3ff] pl-10 pr-4 py-[10px]">
                                <div className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/X3jXi0uKsm.png)] bg-cover bg-no-repeat" />
                                <span className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-normal leading-[17px] tracking-[-0.35px] text-[#6b7280]">
                                    Buscar...
                                </span>
                            </div>
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                <div className="h-[20px] w-[16px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/4pmBka5dZ8.png)] bg-cover bg-no-repeat" />
                                <div className="absolute right-[7px] top-[8px] h-2 w-2 rounded-full bg-[#ba1a1a]" />
                            </div>
                            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[rgba(0,82,204,0.2)] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/GtEyW4VDxX.png)] bg-cover bg-no-repeat" />
                        </div>
                    </header>

                    <section className="px-8 py-8">
                        <div className="flex items-end justify-between gap-6">
                            <div>
                                <h1 className="[font-family:'Manrope-Bold',Helvetica] text-[36px] font-bold leading-10 tracking-[-0.9px] text-[#1e40af]">
                                    Resumen Ejecutivo
                                </h1>
                                <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[16px] leading-6 text-[#434654]">
                                    Flujo de capital en tiempo real y evaluación de riesgos.
                                </p>
                            </div>
                            <div className="rounded-full bg-[#e2e7ff] px-4 py-2">
                                <span className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[0.6px] text-[#005236]">
                                    Saludable
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                            <div className="rounded-[48px] bg-white p-8 shadow-[0_20px_40px_-24px_rgba(19,27,46,0.22)]">
                                <div className="flex items-center gap-2">
                                    <div className="h-[18px] w-[18px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/AEGAVWW9Xx.png)] bg-cover bg-no-repeat" />
                                    <span className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                        Auditoría de Salud Financiera
                                    </span>
                                </div>

                                <div className="mt-8 space-y-5 border-t border-[#eaedff] pt-6">
                                    <div className="flex items-start justify-between gap-6">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[1.2px] text-[#434654]">
                                                Capital inicial
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[#94a3b8]">
                                                Saldo al inicio del periodo
                                            </p>
                                        </div>
                                        <div className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-8 text-[#131b2e]">
                                            S/124,500.00
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-6 border-t border-[#eaedff] pt-5">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[1.2px] text-[#434654]">
                                                Total ingresos
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[#94a3b8]">
                                                Rendimiento mensual total
                                            </p>
                                        </div>
                                        <div className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-8 text-[#006c49]">
                                            +S/42,180.50
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-6 border-t border-[#eaedff] pt-5">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold uppercase tracking-[1.2px] text-[#434654]">
                                                Total gastos
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[#94a3b8]">
                                                Gastos operativos
                                            </p>
                                        </div>
                                        <div className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-8 text-[#ba1a1a]">
                                            -S/18,340.20
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-between gap-6 rounded-[48px] bg-[rgba(0,61,155,0.05)] px-6 py-6 border border-[rgba(255,255,255,0.5)]">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[12px] font-bold uppercase tracking-[1.2px] text-[#003d9b]">
                                                Capital disponible actual
                                            </div>
                                            <p className="mt-1 text-[14px] leading-5 text-[rgba(29,78,216,0.6)]">
                                                Activos líquidos
                                            </p>
                                        </div>
                                        <div className="[font-family:'Manrope-Bold',Helvetica] text-[30px] font-bold leading-9 text-[#003d9b]">
                                            S/148,340.30
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[48px] bg-white p-8 shadow-[0_20px_40px_-24px_rgba(19,27,46,0.22)]">
                                <div className="flex items-start justify-between gap-4">
                                    <span className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                        Desglose de Gastos
                                    </span>
                                    <span className="[font-family:'Inter-SemiBold',Helvetica] text-[14px] font-bold leading-5 text-[#003d9b]">
                                        Detalles
                                    </span>
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-10 rounded-[40px] bg-[#f8faff] p-8">
                                    <div className="relative flex h-48 w-48 items-center justify-center">
                                        <div className="absolute inset-0 rounded-full bg-[conic-gradient(#003d9b_0_45%,#006c49_45%_70%,#ba1a1a_70%_85%,#984100_85%_100%)]" />
                                        <div className="absolute inset-5 rounded-full bg-[#faf8ff]" />
                                        <div className="relative z-10 text-center">
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[30px] font-bold leading-9 text-[#131b2e]">
                                                18k
                                            </div>
                                            <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#434654]">
                                                Gastos tot.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[14px] font-bold text-[#131b2e]">Activos Fijos</div>
                                            <div className="text-[12px] text-[#434654]">45% • S/8,253.00</div>
                                        </div>
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[14px] font-bold text-[#131b2e]">Operativo</div>
                                            <div className="text-[12px] text-[#434654]">25% • S/4,585.05</div>
                                        </div>
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[14px] font-bold text-[#131b2e]">Obligación Fiscal</div>
                                            <div className="text-[12px] text-[#434654]">15% • S/2,751.03</div>
                                        </div>
                                        <div>
                                            <div className="[font-family:'Inter-SemiBold',Helvetica] text-[14px] font-bold text-[#131b2e]">Misceláneo</div>
                                            <div className="text-[12px] text-[#434654]">15% • S/2,751.03</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4 rounded-[32px] bg-[#f2f3ff] p-5 border border-[rgba(255,255,255,0.5)]">
                                    <div className="flex items-center gap-2">
                                        <div className="h-[7px] w-[11.667px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/sEtP0HEFDG.png)] bg-cover bg-no-repeat" />
                                        <span className="[font-family:'Inter-SemiBold',Helvetica] text-[10px] font-bold uppercase tracking-[1px] text-[#006c49]">
                                            Previsión de crecimiento
                                        </span>
                                    </div>
                                    <div className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                        +12.4%
                                    </div>
                                    <p className="text-[10px] leading-[15px] text-[#434654]">
                                        Aumento proyectado en activos líquidos para el 4T.
                                    </p>
                                </div>

                                <div className="mt-4 space-y-4 rounded-[32px] bg-[#f2f3ff] p-5 border border-[rgba(255,255,255,0.5)]">
                                    <div className="flex items-center gap-2">
                                        <div className="h-[11.667px] w-[9.333px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/cR2vHwC5ha.png)] bg-cover bg-no-repeat" />
                                        <span className="[font-family:'Inter-SemiBold',Helvetica] text-[10px] font-bold uppercase tracking-[1px] text-[#ba1a1a]">
                                            Mitigación de riesgos
                                        </span>
                                    </div>
                                    <div className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#131b2e]">
                                        98.2%
                                    </div>
                                    <p className="text-[10px] leading-[15px] text-[#434654]">
                                        Nivel de confianza en el colchón de liquidez actual.
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