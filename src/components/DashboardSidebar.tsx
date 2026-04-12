export const DashboardSidebar = () => {
    const primaryItems = [
        { label: "Tablero", icon: "hX43M1ppbz.png", active: true },
        { label: "Registros", icon: "XBTeeWFNKO.png", active: false },
        { label: "Programados", icon: "calendar", active: false },
    ];

    return (
        <aside className="absolute left-0 top-0 z-20 flex min-h-screen w-[288px] flex-col gap-2 bg-[#f2f3ff] px-6 py-6">
            <div className="flex items-center gap-3 pb-6">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/mee9vB8FWX.png)] bg-cover bg-no-repeat" />
                <div className="flex flex-col">
                    <span className="[font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-7 text-[#003d9b]">
                        Solix
                    </span>
                    <span className="[font-family:'Inter-Regular',Helvetica] text-[10px] font-medium uppercase tracking-[0.5px] text-[#64748b]">
                        Libro mayor etéreo
                    </span>
                </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
                {primaryItems.map(({ label, icon, active }) => (
                    <div
                        key={label}
                        className={`flex items-center gap-3 rounded-full px-4 py-3 ${active ? "bg-white text-[#0052cc] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]" : "text-[#434654]"}`}
                    >
                        {icon === "calendar" ? (
                            <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-current">
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
                                    <path d="M7 2v3M17 2v3M3.5 9h17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" strokeWidth="2" />
                                    <path d="M7.5 12h4M7.5 16h4M13.5 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        ) : (
                            <div
                                className="h-[18px] w-[18px] shrink-0 bg-cover bg-no-repeat"
                                style={{ backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/${icon})` }}
                            />
                        )}
                        <span className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-medium leading-[21px]">
                            {label}
                        </span>
                    </div>
                ))}

                <div className="mt-4 border-b border-b-[rgba(226,232,240,0.5)] pt-4" />

                <div className="flex items-center gap-3 rounded-full px-4 py-3 text-[#434654]">
                    <div
                        className="h-[18px] w-[18px] shrink-0 bg-cover bg-no-repeat"
                        style={{ backgroundImage: "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/M8JYveLffY.png)" }}
                    />
                    <span className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-medium leading-[21px]">
                        Cerrar sesión
                    </span>
                </div>
            </nav>
        </aside>
    );
};