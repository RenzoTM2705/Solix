// Barra superior del dashboard con notificaciones contextuales y menu de perfil.
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ProfileMenu } from "./ProfileMenu";

const TopBarNotifications = lazy(() =>
    import("./TopBarNotifications").then((module) => ({ default: module.TopBarNotifications })),
);

// Renderiza la barra superior con alertas, marca y menú de perfil.
export const AppTopBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationNow, setNotificationNow] = useState(0);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const bellButtonRef = useRef<HTMLButtonElement | null>(null);
    const [panelPosition, setPanelPosition] = useState({ top: 72, left: 16, width: 340, contentMaxHeight: 280 });

    const updatePanelPosition = () => {
        const button = bellButtonRef.current;
        if (!button) {
            return;
        }

        const rect = button.getBoundingClientRect();
        const margin = 16;
        const width = Math.min(340, window.innerWidth - margin * 2);
        const desiredLeft = rect.right - width;
        const left = Math.max(margin, Math.min(desiredLeft, window.innerWidth - width - margin));

        // Sin separación: el panel inicia justo al terminar el icono.
        const top = rect.bottom;

        // Asegura que el contenido sea scrollable y no se salga por abajo del viewport.
        const availableBelow = window.innerHeight - top - margin;
        const contentMaxHeight = Math.max(120, Math.min(360, availableBelow - 56));

        setPanelPosition({ top, left, width, contentMaxHeight });
    };

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

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        // Calcula posición tras el render para evitar forzar layout en el click.
        const rafId = window.requestAnimationFrame(() => {
            updatePanelPosition();
        });

        const handleResize = () => updatePanelPosition();
        const handleScroll = () => updatePanelPosition();
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll, true);

        return () => {
            window.cancelAnimationFrame(rafId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [isOpen]);

    return (
        <header className="flex flex-col gap-3 bg-[rgba(250,248,255,0.8)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <img
                    src="/Solix%20logo.webp"
                    alt="Solix Logo"
                    className="h-8 w-8 object-contain"
                    width={32}
                    height={32}
                />
                <span className="[font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-8 text-[#003d9b]">
                    Solix
                </span>
            </div>

            <div className="flex w-full items-center justify-end gap-3 sm:w-auto sm:gap-4">
                <div ref={wrapperRef} className="relative">
                    <button
                        ref={bellButtonRef}
                        type="button"
                        aria-label="Abrir notificaciones"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                        onClick={() => {
                            setNotificationNow(Date.now());
                            setNotificationsEnabled(true);
                            setIsOpen((prev) => !prev);
                        }}
                        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052cc]"
                    >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 text-[#434654]">
                            <path d="M6 10a6 6 0 1 1 12 0v4.5l1.2 2.2a1 1 0 0 1-.88 1.48H5.68a1 1 0 0 1-.88-1.48L6 14.5V10Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>

                    {isOpen && notificationsEnabled && (
                        <Suspense fallback={null}>
                            <TopBarNotifications
                                top={panelPosition.top}
                                left={panelPosition.left}
                                width={panelPosition.width}
                                contentMaxHeight={panelPosition.contentMaxHeight}
                                nowTimestamp={notificationNow}
                            />
                        </Suspense>
                    )}
                </div>
                <ProfileMenu avatarClassName="h-10 w-10" />
            </div>
        </header>
    );
};