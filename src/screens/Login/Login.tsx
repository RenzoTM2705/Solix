import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAuthErrorMessage } from "../../services/auth.service";
// import icon from "./icon.svg";
// import icon2 from "./icon-2.svg";
// import image from "./image.svg";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(getAuthErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-start relative bg-[#faf8ff]">
            <div className="flex min-h-[1024px] items-center justify-center px-12 py-[90px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
                    <div className="absolute top-[-102px] -left-32 w-[600px] h-[600px] bg-[#dae2ff4c] rounded-full blur-[50px]" />
                    <div className="absolute -right-32 bottom-[-102px] w-[500px] h-[500px] bg-[#6ffbbe33] rounded-full blur-[50px]" />
                </div>
                <div className="flex flex-col max-w-md w-[448px] items-start gap-10 relative">
                    <div className="flex items-start justify-center relative self-stretch w-full flex-[0_0_auto]">
                        <div className="inline-flex items-center gap-2 px-4 py-2 relative self-stretch flex-[0_0_auto] bg-[#dae2fd] rounded-full">
                            <div className="inline-flex flex-col h-8 items-start pl-0 pr-2 py-0 relative flex-[0_0_auto]">
                                <div className="relative w-8 h-8 aspect-[1] bg-[url(/solix-logo.png)] bg-cover bg-[50%_50%]" />
                            </div>
                            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                                <div className="flex items-center [font-family:'Manrope-Bold',Helvetica] font-bold text-[#003d9b] text-lg tracking-[-0.45px] leading-7 whitespace-nowrap relative w-fit mt-[-1.00px]">
                                    Solix
                                </div>
                            </div>
                        </div>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col items-start gap-8 p-10 relative self-stretch flex-[0_0_auto] bg-[#ffffffcc] border border-solid border-[#c3c6d633] backdrop-blur-md backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(12px)_brightness(100%)] w-full rounded-[32px]"
                    >
                        <div className="absolute h-full top-0 left-0 bg-[#ffffff01] shadow-[0px_8px_10px_-6px_#131b2e0d,0px_20px_25px_-5px_#131b2e0d] w-full rounded-[32px]" />
                        <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
                            <div className="flex flex-col items-center relative self-stretch w-full flex-[0_0_auto]">
                                <h1 className="flex items-center justify-center [font-family:'Manrope-Bold',Helvetica] font-bold text-[#131b2e] text-4xl text-center tracking-[-0.90px] leading-10 whitespace-nowrap relative w-fit mt-[-1.00px]">
                                    Bienvenido
                                </h1>
                            </div>
                            <div className="flex flex-col items-center relative self-stretch w-full flex-[0_0_auto]">
                                <p className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#434654] text-base text-center tracking-[0] leading-6 relative w-fit mt-[-1.00px]">
                                    Accede a tu cuenta para gestionar tu futuro
                                    <br />
                                    financiero.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-6 pt-2 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
                            {error && (
                                <p className="[font-family:'Inter-Regular',Helvetica] text-sm text-[#dc2626]">
                                    {error}
                                </p>
                            )}
                            <div className="relative self-stretch w-full h-[84px]">
                                <label
                                    htmlFor="email"
                                    className="absolute top-0 left-1 h-5 flex items-center [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#131b2e] text-sm tracking-[0] leading-5 whitespace-nowrap"
                                >
                                    Correo Electrónico
                                </label>
                                <div className="flex flex-col w-full items-start absolute top-7 left-0">
                                    <div className="flex items-start justify-center pl-12 pr-4 py-[18px] relative self-stretch w-full flex-[0_0_auto] bg-[#f2f3ff] rounded-[32px] overflow-hidden">
                                        <input
                                            id="email"
                                            className="relative grow border-[none] [background:none] self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#73768599] text-base tracking-[0] leading-[normal] p-0 outline-none"
                                            placeholder="tu@email.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                        />
                                    </div>
                                    <div className="inline-flex h-full items-center absolute top-0 left-4">
                                        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                                            <img
                                                className="relative w-[15px] h-[15px]"
                                                alt="Icon"
                                                // src={icon}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                                <div className="flex items-center justify-between px-1 py-0 relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                                        <label
                                            htmlFor="password"
                                            className="flex items-center [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#131b2e] text-sm tracking-[0] leading-5 whitespace-nowrap relative w-fit mt-[-1.00px]"
                                        >
                                            Contraseña
                                        </label>
                                    </div>
                                    <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                                        <a
                                            href="#"
                                            className="flex items-center [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#003d9b] text-xs tracking-[0] leading-4 whitespace-nowrap relative w-fit mt-[-1.00px]"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                                    <div className="flex items-start justify-center pl-12 pr-4 py-[18px] relative self-stretch w-full flex-[0_0_auto] bg-[#f2f3ff] rounded-[32px] overflow-hidden">
                                        <input
                                            id="password"
                                            className="relative grow border-[none] [background:none] self-stretch mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#73768599] text-base tracking-[0] leading-[normal] p-0 outline-none"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#003d9b] text-xs tracking-[0] leading-4"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? "Ocultar" : "Mostrar"}
                                    </button>
                                    <div className="inline-flex h-full items-center absolute top-0 left-4">
                                        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                                            <img
                                                className="h-[15.75px] relative w-3"
                                                alt="Icon"
                                                // src={image}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-0 py-2 relative self-stretch w-full flex-[0_0_auto]">
                                <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={rememberMe}
                                    onClick={() => setRememberMe(!rememberMe)}
                                    className={`relative w-5 h-5 rounded-2xl border border-solid border-[#c3c6d6] flex items-center justify-center transition-colors ${rememberMe ? "bg-[#003d9b]" : "bg-white"}`}
                                >
                                    {rememberMe && (
                                        <svg
                                            width="12"
                                            height="9"
                                            viewBox="0 0 12 9"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M1 4L4.5 7.5L11 1"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </button>
                                <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                                    <span className="flex items-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#434654] text-sm tracking-[0] leading-5 whitespace-nowrap relative w-fit mt-[-1.00px]">
                                        Recordar mi sesión
                                    </span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="all-[unset] box-border flex items-center justify-center px-0 py-4 relative self-stretch w-full flex-[0_0_auto] rounded-full bg-[linear-gradient(169deg,rgba(0,61,155,1)_0%,rgba(0,82,204,1)_100%)] cursor-pointer"
                            >
                                <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-full shadow-[0px_4px_6px_-4px_#003d9b33,0px_10px_15px_-3px_#003d9b33]" />
                                <span className="flex items-center justify-center [font-family:'Manrope-Bold',Helvetica] font-bold text-white text-lg text-center tracking-[0] leading-7 whitespace-nowrap relative w-fit mt-[-1.00px]">
                                    {submitting ? "Ingresando..." : "Iniciar Sesión"}
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                            <div className="relative flex-1 grow h-px bg-[#c3c6d64c]" />
                            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                                <span className="flex items-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#737685] text-xs tracking-[1.20px] leading-4 whitespace-nowrap relative w-fit mt-[-1.00px]">
                                    O CONTINÚA CON
                                </span>
                            </div>
                            <div className="relative flex-1 grow h-px bg-[#c3c6d64c]" />
                        </div>
                        <div className="grid grid-cols-2 grid-rows-[54px] h-fit gap-4 w-full">
                            <button
                                type="button"
                                className="all-[unset] box-border col-[1_/_2] pl-[48.38px] pr-[48.39px] py-4 relative row-[1_/_2] w-fit h-fit inline-flex items-center justify-center gap-2 bg-[#eaedff] rounded-full border border-solid border-[#c3c6d633] cursor-pointer"
                            >
                                <div className="relative w-5 h-5 bg-[url(/google.png)] bg-cover bg-[50%_50%]" />
                                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                                    <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#131b2e] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                                        Google
                                    </span>
                                </div>
                            </button>
                            <button
                                type="button"
                                className="all-[unset] box-border col-[2_/_3] pl-[53.69px] pr-[53.7px] py-3 relative row-[1_/_2] w-fit h-fit inline-flex items-center justify-center gap-2 bg-[#eaedff] rounded-full border border-solid border-[#c3c6d633] cursor-pointer"
                            >
                                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                                    <img
                                        className="h-[7.5px] relative w-3"
                                        alt="Icon"
                                        // src={icon2}
                                    />
                                </div>
                                <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                                    <span className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#131b2e] text-sm text-center tracking-[0] leading-5 whitespace-nowrap">
                                        Apple
                                    </span>
                                </div>
                            </button>
                        </div>
                        <div className="flex items-start justify-center gap-1 pt-2 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
                            <span className="flex items-center justify-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#434654] text-base text-center tracking-[0] leading-6 whitespace-nowrap relative w-fit mt-[-1.00px]">
                                ¿No tienes una cuenta?
                            </span>
                            <Link
                                to="/registro-usuario"
                                className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#003d9b] text-base text-center tracking-[0] leading-6 whitespace-nowrap"
                            >
                                Crear cuenta
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
