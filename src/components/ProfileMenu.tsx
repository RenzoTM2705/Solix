// Menú de perfil con avatar editable, acceso a login/logout y carga de imagen.
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { getAuthErrorMessage, updateUserAvatar } from "../services/auth.service";

type ProfileMenuProps = {
    className?: string;
    avatarClassName?: string;
};

// Muestra el avatar del usuario y las acciones de sesión y perfil.
export const ProfileMenu = ({ className = "", avatarClassName = "h-10 w-10" }: ProfileMenuProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { profile, refreshProfile } = useProfile();
    const [open, setOpen] = useState(false);
    const [avatarError, setAvatarError] = useState("");
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const avatarUrl = profile?.avatar_url
        || (typeof user?.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : "");
    const profileName = typeof user?.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name.trim()
        : "";
    const displayName = profileName || "Usuario";
    const displayInitial = displayName.charAt(0).toUpperCase();
    const supabaseBaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "") ?? "";
    const resolvedAvatarUrl = avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")
        ? avatarUrl
        : avatarUrl.startsWith("/")
            ? `${supabaseBaseUrl}${avatarUrl}`
            : avatarUrl
                ? `${supabaseBaseUrl}/storage/v1/object/public/${avatarUrl.replace(/^\/+/, "")}`
                : "";

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

    // Cierra la sesión actual y devuelve al usuario al login.
    const handleLogout = async () => {
        try {
            await logout();
            setOpen(false);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("No se pudo cerrar sesion", error);
        }
    };

    // Lleva al usuario a la pantalla de acceso.
    const handleLogin = () => {
        setOpen(false);
        navigate("/", { replace: true });
    };

    // Abre el selector de archivos para cambiar la foto.
    const handleAvatarClick = () => {
        setAvatarError("");
        fileInputRef.current?.click();
    };

    // Valida la imagen elegida y la sube al perfil del usuario.
    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file || !user?.id) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setAvatarError("Selecciona una imagen válida.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setAvatarError("La imagen no debe superar 2MB.");
            return;
        }

        try {
            setUploadingAvatar(true);
            setAvatarError("");
            await updateUserAvatar(user.id, file);
            await refreshProfile(true);
            setOpen(false);
        } catch (error) {
            const message =
                typeof error === "object" && error !== null && "message" in error
                    ? String((error as { message?: string }).message ?? "")
                    : "";
            setAvatarError(message || getAuthErrorMessage(error));
        } finally {
            setUploadingAvatar(false);
            event.target.value = "";
        }
    };

    return (
        <div ref={menuRef} className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
            />
            <button
                type="button"
                aria-label="Abrir menú de perfil"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052cc]"
            >
                <div className={`${avatarClassName} overflow-hidden rounded-full border border-[rgba(0,82,204,0.14)] bg-[#eaf0ff] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]`}>
                    {resolvedAvatarUrl ? (
                        <img
                            src={resolvedAvatarUrl}
                            alt="Foto de perfil"
                            width={40}
                            height={40}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#dbeafe_0%,#bfdbfe_100%)] [font-family:'Inter-SemiBold',Helvetica] text-[14px] text-[#1d4ed8]">
                            {displayInitial}
                        </div>
                    )}
                </div>
            </button>

            {open && (
                <div className="absolute right-0 top-full z-[260] mt-3 w-60 overflow-hidden rounded-[24px] border border-[rgba(195,198,214,0.25)] bg-white shadow-[0_20px_40px_0_rgba(19,27,46,0.14)]">
                    <div className="border-b border-[rgba(195,198,214,0.22)] px-4 py-4">
                        <p className="[font-family:'Inter-SemiBold',Helvetica] text-[13px] font-semibold text-[#131b2e]">
                            {displayName}
                        </p>
                        <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[12px] text-[#6b7280]">
                            {user ? "Sesión activa" : "Ingresa para continuar"}
                        </p>
                    </div>

                    <div className="p-2">
                        {user && (
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                disabled={uploadingAvatar}
                                className="mb-2 flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-[#434654] transition-colors hover:bg-[#f2f3ff] hover:text-[#0052cc] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <svg
                                    className="h-[18px] w-[18px] shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 8.5C4 7.67157 4.67157 7 5.5 7H8L9.2 5.2C9.47836 4.78246 9.94715 4.5 10.45 4.5H13.55C14.0528 4.5 14.5216 4.78246 14.8 5.2L16 7H18.5C19.3284 7 20 7.67157 20 8.5V17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5V8.5Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle cx="12" cy="13" r="3.25" stroke="currentColor" strokeWidth="1.8" />
                                </svg>
                                <span className="[font-family:'Inter-Regular',Helvetica] text-[14px] font-medium leading-[21px]">
                                    {uploadingAvatar ? "Subiendo foto..." : "Cambiar foto"}
                                </span>
                            </button>
                        )}

                        {avatarError && (
                            <p className="mb-2 px-4 [font-family:'Inter-Regular',Helvetica] text-[12px] text-[#dc2626]">
                                {avatarError}
                            </p>
                        )}

                        {user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left text-[#434654] transition-colors hover:bg-[#f2f3ff] hover:text-[#0052cc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0052cc]"
                            >
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
                                    <path d="M15 7V4.5A1.5 1.5 0 0 0 13.5 3h-7A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h7a1.5 1.5 0 0 0 1.5-1.5V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M11 12h10M18 8l3 4-3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
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
                                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px] shrink-0">
                                    <path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h7A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 9 19.5V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M13 12H3m7-4-3 4 3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
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