import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type ProfileMenuProps = {
    className?: string;
    avatarClassName?: string;
};

export const ProfileMenu = ({ className = "", avatarClassName = "h-10 w-10" }: ProfileMenuProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideInteraction);
        document.addEventListener("touchstart", handleOutsideInteraction);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideInteraction);
            document.removeEventListener("touchstart", handleOutsideInteraction);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setOpen(false);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("No se pudo cerrar sesion", error);
        }
    };

    const handleLogin = () => {
        setOpen(false);
        navigate("/", { replace: true });
    };

    return (
        <div ref={menuRef} className={`relative ${className}`}>
            <button
                type="button"
                aria-label="Abrir menú de perfil"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052cc]"
            >
                <div
                    className={`${avatarClassName} overflow-hidden rounded-full border border-[rgba(0,82,204,0.14)] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/GtEyW4VDxX.png)] bg-cover bg-no-repeat shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]`}
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-[260] mt-3 w-60 overflow-hidden rounded-[24px] border border-[rgba(195,198,214,0.25)] bg-white shadow-[0_20px_40px_0_rgba(19,27,46,0.14)]">
                    <div className="border-b border-[rgba(195,198,214,0.22)] px-4 py-4">
                        <p className="[font-family:'Inter-SemiBold',Helvetica] text-[13px] font-semibold text-[#131b2e]">
                            {user?.email ?? "Acceso a Solix"}
                        </p>
                        <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[12px] text-[#6b7280]">
                            {user ? "Sesión activa" : "Ingresa para continuar"}
                        </p>
                    </div>

                    <div className="p-2">
                        {user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-[#434654] transition-colors hover:bg-[#f2f3ff] hover:text-[#0052cc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052cc]"
                            >
                                <div
                                    className="h-[18px] w-[18px] shrink-0 bg-cover bg-no-repeat"
                                    style={{ backgroundImage: "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/M8JYveLffY.png)" }}
                                />
                                <span className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-medium leading-[21px]">
                                    Cerrar sesión
                                </span>
                            </button>
                        ) : (
                            <Link
                                to="/"
                                onClick={handleLogin}
                                className="flex items-center gap-3 rounded-[18px] px-4 py-3 text-[#434654] transition-colors hover:bg-[#f2f3ff] hover:text-[#0052cc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052cc]"
                            >
                                <div
                                    className="h-[18px] w-[18px] shrink-0 bg-cover bg-no-repeat"
                                    style={{ backgroundImage: "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/M8JYveLffY.png)" }}
                                />
                                <span className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-medium leading-[21px]">
                                    Iniciar sesión
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};