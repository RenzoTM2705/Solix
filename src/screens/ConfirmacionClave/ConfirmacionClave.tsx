// Pantalla de confirmacion cuando el correo de recuperacion fue enviado.
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export const ConfirmacionClave = () => {
    const metaDescription = useMemo(
        () => "Confirmacion de envio del correo para restablecer tu contraseña en Solix.",
        []
    );

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Correo enviado | Solix";

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

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#faf8ff] px-4 py-10 sm:px-6 md:px-10 lg:px-12">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-28 top-[-110px] h-[560px] w-[560px] rounded-full bg-[#dae2ff4c] blur-[52px]" />
                <div className="absolute -right-28 bottom-[-120px] h-[500px] w-[500px] rounded-full bg-[#6ffbbe33] blur-[52px]" />
            </div>

            <section className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
                <article className="w-full rounded-[32px] border border-solid border-[#c3c6d633] bg-[#ffffffcc] p-8 text-center shadow-[0px_8px_10px_-6px_#131b2e0d,0px_20px_25px_-5px_#131b2e0d] backdrop-blur-md backdrop-brightness-[100%] sm:p-10">
                    <img
                        src="/Solix logo.webp"
                        alt="Solix"
                        className="mx-auto h-20 w-20 object-contain"
                        loading="lazy"
                    />

                    <h1 className="mt-5 [font-family:'Manrope-Bold',Helvetica] text-3xl font-bold leading-9 tracking-[-0.75px] text-[#131b2e]">
                        Correo enviado
                    </h1>

                    <p className="mt-3 [font-family:'Inter-Regular',Helvetica] text-base leading-6 text-[#434654]">
                        Hemos enviado un enlace de recuperacion a tu correo electronico. Revisa tu bandeja de entrada.
                    </p>

                    <Link
                        to="/"
                        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(169deg,rgba(0,61,155,1)_0%,rgba(0,82,204,1)_100%)] px-4 py-4 [font-family:'Manrope-Bold',Helvetica] text-base font-bold leading-6 text-white"
                    >
                        Volver al inicio de sesion
                    </Link>

                    <div className="mt-6 border-t border-solid border-[#c3c6d64c] pt-4">
                        <Link
                            to="/recuperar-clave"
                            className="[font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold leading-5 text-[#003d9b]"
                        >
                            Reenviar correo
                        </Link>
                    </div>
                </article>
            </section>
        </main>
    );
};