// Navegacion lateral principal del dashboard.
import { NavLink } from "react-router-dom";

export const DashboardSidebar = () => {
    const primaryItems = [
        { label: "Tablero", icon: "dashboard", to: "/dashboard" },
        { label: "Registros", icon: "registros", to: "/registros" },
        { label: "Programados", icon: "calendar", to: "/gastos-programados" },
    ];

    const navItemBaseClass =
        "shrink-0 flex items-center gap-3 rounded-full px-4 py-3 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052cc]";

    return (
        <aside className="relative z-20 flex w-full flex-col gap-2 bg-[#f2f3ff] px-4 py-4 lg:fixed lg:inset-y-0 lg:left-0 lg:w-[288px] lg:overflow-y-auto lg:px-6 lg:py-6">
            <div className="flex items-start gap-3 pb-3 lg:pb-6">
                <a
                    href="/dashboard"
                    aria-label="Ir al tablero de Solix"
                    className="flex items-center gap-3 rounded-xl transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052cc]"
                >
                    <img src="/Solix%20logo.webp" alt="Solix" className="h-10 w-10 rounded-full object-cover" width={40} height={40} />
                    <div className="flex flex-col">
                        <span className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#003d9b]">
                            Solix
                        </span>
                    </div>
                </a>
            </div>

            <nav aria-label="Navegacion principal" className="flex flex-1 flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
                {primaryItems.map(({ label, icon, to }) => (
                    <NavLink
                        key={label}
                        to={to}
                        className={({ isActive }) =>
                            `${navItemBaseClass} ${
                                isActive
                                    ? "bg-white text-[#0052cc] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
                                    : "text-[#434654] hover:bg-white/80 hover:text-[#0052cc] hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
                            }`
                        }
                    >
                        <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-current">
                            {icon === "dashboard" && (
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
                                    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <rect x="13" y="3" width="8" height="5" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <rect x="13" y="10" width="8" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            )}
                            {icon === "registros" && (
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
                                    <path d="M6 4h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M6 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M6 16h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            )}
                            {icon === "calendar" && (
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
                                    <path d="M7 2v3M17 2v3M3.5 9h17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" strokeWidth="2" />
                                    <path d="M7.5 12h4M7.5 16h4M13.5 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            )}
                        </div>
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-medium leading-[21px]">
                            {label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-2 lg:w-full lg:pt-4" />
        </aside>
    );
};
