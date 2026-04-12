import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAuthErrorMessage } from "../../services/auth.service";

export const RegistroUsuario = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!fullName.trim()) {
            setError("Ingresa tu nombre completo.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setSubmitting(true);

        try {
            await register(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(getAuthErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#faf8ff]">
            <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-8 md:px-12 md:py-20">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-32 top-[-102px] h-[560px] w-[560px] rounded-full bg-[#dae2ff4c] blur-[50px]" />
                    <div className="absolute -right-32 bottom-[-102px] h-[500px] w-[500px] rounded-full bg-[#6ffbbe33] blur-[50px]" />
                </div>

                <div className="relative z-10 flex w-full max-w-md flex-col items-start gap-8">
                    <div className="flex w-full items-center justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#dae2fd] px-4 py-2">
                            <img
                                src="/Solix logo.webp"
                                alt="Solix Logo"
                                className="h-8 w-8 object-contain"
                            />
                            <span className="[font-family:'Manrope-Bold',Helvetica] text-lg font-bold leading-7 tracking-[-0.45px] text-[#003d9b]">
                                Solix
                            </span>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="relative w-full rounded-[32px] border border-solid border-[#c3c6d633] bg-[#ffffffcc] p-8 backdrop-blur-md backdrop-brightness-[100%] sm:p-10 [-webkit-backdrop-filter:blur(12px)_brightness(100%)]"
                    >
                        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[#ffffff01] shadow-[0px_8px_10px_-6px_#131b2e0d,0px_20px_25px_-5px_#131b2e0d]" />

                        <div className="relative flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-3 text-center">
                                <h1 className="[font-family:'Manrope-Bold',Helvetica] text-4xl font-bold leading-10 tracking-[-0.90px] text-[#131b2e]">
                                    Crear Cuenta
                                </h1>
                                <p className="[font-family:'Inter-Regular',Helvetica] text-base font-normal leading-6 text-[#434654]">
                                    Únete a Solix y comienza a gestionar tu futuro
                                    <br />
                                    financiero.
                                </p>
                            </div>

                            <div className="flex flex-col gap-5">
                                {error && (
                                    <p className="[font-family:'Inter-Regular',Helvetica] text-sm text-[#dc2626]">
                                        {error}
                                    </p>
                                )}
                                <div>
                                    <label className="mb-2 ml-1 block [font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-5 text-[#131b2e]">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full rounded-[32px] bg-[#f2f3ff] px-5 py-[18px] [font-family:'Inter-Regular',Helvetica] text-base text-[#737685] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 ml-1 block [font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-5 text-[#131b2e]">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@ejemplo.com"
                                        className="w-full rounded-[32px] bg-[#f2f3ff] px-5 py-[18px] [font-family:'Inter-Regular',Helvetica] text-base text-[#737685] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 ml-1 block [font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-5 text-[#131b2e]">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-[32px] bg-[#f2f3ff] px-5 py-[18px] [font-family:'Inter-Regular',Helvetica] text-base text-[#737685] outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 ml-1 block [font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-5 text-[#131b2e]">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-[32px] bg-[#f2f3ff] px-5 py-[18px] [font-family:'Inter-Regular',Helvetica] text-base text-[#737685] outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="relative flex w-full items-center justify-center rounded-full bg-[linear-gradient(169deg,rgba(0,61,155,1)_0%,rgba(0,82,204,1)_100%)] px-0 py-4"
                            >
                                <span className="[font-family:'Manrope-Bold',Helvetica] text-lg font-bold leading-7 text-white">
                                    {submitting ? "Creando cuenta..." : "Registrarse"}
                                </span>
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-[#c3c6d64c]" />
                                <span className="[font-family:'Inter-Regular',Helvetica] text-xs font-normal tracking-[1.2px] text-[#737685]">
                                    O REGÍSTRATE CON
                                </span>
                                <div className="h-px flex-1 bg-[#c3c6d64c]" />
                            </div>

                            <div className="grid w-full grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-solid border-[#c3c6d633] bg-[#eaedff] px-4 py-3"
                                >
                                    <div className="h-5 w-5 bg-[url(/google.png)] bg-cover bg-center" />
                                    <span className="[font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-5 text-[#131b2e]">
                                        Google
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-solid border-[#c3c6d633] bg-[#eaedff] px-4 py-3"
                                >
                                    <span className="[font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-5 text-[#131b2e]">
                                        Apple
                                    </span>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-1 pt-1 text-center">
                                <span className="[font-family:'Inter-Regular',Helvetica] text-base font-normal leading-6 text-[#434654]">
                                    ¿Ya tienes una cuenta?
                                </span>
                                <Link
                                    to="/"
                                    className="[font-family:'Inter-Bold',Helvetica] text-base font-bold leading-6 text-[#003d9b]"
                                >
                                    Iniciar Sesión
                                </Link>
                            </div>
                        </div>
                    </form>

                    <div className="w-full text-center [font-family:'Inter-Regular',Helvetica] text-xs font-normal leading-4 text-[#73768599]">
                        © 2024 Solix Finance. Secure & Ethereal.
                    </div>
                </div>
            </div>
        </div>
    );
}