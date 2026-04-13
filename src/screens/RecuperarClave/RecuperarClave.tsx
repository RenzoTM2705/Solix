// Pantalla para solicitar el correo de recuperacion de contraseña.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuthErrorMessage, requestPasswordReset } from "../../services/auth.service";

export const RecuperarClave = () => {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const metaDescription = useMemo(
        () => "Recupera tu acceso a Solix enviando instrucciones para restablecer tu contraseña de forma segura.",
        []
    );

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Recuperar contraseña | Solix";

        const descriptionMeta = document.querySelector('meta[name="description"]');
        const previousDescription = descriptionMeta?.getAttribute("content") ?? "";

        if (descriptionMeta) {
            descriptionMeta.setAttribute("content", metaDescription);
        }

        return () => {
            document.title = previousTitle;
            if (descriptionMeta) {
                descriptionMeta.setAttribute("content", previousDescription);
            }
        };
    }, [metaDescription]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Se necesita ingresar un correo");
            return;
        }

        setSubmitting(true);

        try {
            await requestPasswordReset(email);
            navigate("/confirmacion-clave");
        } catch (err) {
            setError(getAuthErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#faf8ff] px-4 py-10 sm:px-6 md:px-10 lg:px-12">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-28 top-[-110px] h-[560px] w-[560px] rounded-full bg-[#dae2ff4c] blur-[52px]" />
                <div className="absolute -right-28 bottom-[-120px] h-[500px] w-[500px] rounded-full bg-[#6ffbbe33] blur-[52px]" />
            </div>

            <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
                <div className="w-full rounded-[32px] border border-solid border-[#c3c6d633] bg-[#ffffffcc] p-8 shadow-[0px_8px_10px_-6px_#131b2e0d,0px_20px_25px_-5px_#131b2e0d] backdrop-blur-md backdrop-brightness-[100%] sm:p-10">
                    <div className="mb-8 flex flex-col items-center gap-3 text-center">
                        <img
                            src="/Solix logo.webp"
                            alt="Solix"
                            className="h-20 w-20 object-contain"
                            loading="lazy"
                        />
                        <h1 className="[font-family:'Manrope-Bold',Helvetica] text-3xl font-bold leading-9 tracking-[-0.75px] text-[#131b2e]">
                            Recuperar contraseña
                        </h1>
                        <p className="[font-family:'Inter-Regular',Helvetica] text-base leading-6 text-[#434654]">
                            Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                        {error && (
                            <p className="[font-family:'Inter-Regular',Helvetica] text-sm text-[#dc2626]" role="alert" aria-live="polite">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="recovery-email"
                                className="[font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-5 text-[#131b2e]"
                            >
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <input
                                    id="recovery-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    inputMode="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="w-full rounded-[32px] bg-[#f2f3ff] px-4 py-[18px] [font-family:'Inter-Regular',Helvetica] text-base text-[#131b2e] outline-none ring-0 placeholder:text-[#737685] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003d9b33]"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(169deg,rgba(0,61,155,1)_0%,rgba(0,82,204,1)_100%)] px-4 py-4 [font-family:'Manrope-Bold',Helvetica] text-base font-bold leading-6 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {submitting ? "Enviando..." : "Enviar correo"}
                        </button>
                    </form>

                    <div className="mt-7 flex justify-center border-t border-solid border-[#c3c6d64c] pt-6">
                        <Link
                            to="/"
                            className="[font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-5 text-[#003d9b]"
                        >
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};