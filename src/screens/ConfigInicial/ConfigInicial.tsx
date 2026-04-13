
// Pantalla de onboarding para definir el capital inicial del usuario.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileMenu } from "../../components/ProfileMenu";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { createProfile, updateProfile } from "../../services/profile.service";
import { getAuthErrorMessage } from "../../services/auth.service";

export const ConfigInicial = () => {
    const [montoInicial, setMontoInicial] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { profile } = useProfile();

    const handleMontoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(",", ".");
        const sanitized = value.replace(/[^0-9.]/g, "");

        if (!sanitized) {
            setMontoInicial("");
            return;
        }

        const [entero, ...resto] = sanitized.split(".");
        const decimales = resto.join("").slice(0, 2);
        const nextValue = resto.length > 0 ? `${entero}.${decimales}` : entero;

        setMontoInicial(nextValue);
    };

    const handleMontoBlur = () => {
        if (!montoInicial) {
            return;
        }

        const numericValue = Number(montoInicial);
        setMontoInicial(Number.isNaN(numericValue) ? "0.00" : numericValue.toFixed(2));
    };

    const handleComenzar = async () => {
        if (isSaving) {
            return;
        }

        setError("");

        if (!montoInicial.trim()) {
            setError("Ingresa un monto inicial válido.");
            return;
        }

        const monto = Number(montoInicial);

        if (!Number.isFinite(monto) || monto <= 0) {
            setError("Ingresa un monto inicial válido.");
            return;
        }

        if (!user?.id) {
            setError("Tu sesión no es válida. Inicia sesión nuevamente.");
            return;
        }

        setIsSaving(true);

        try {
            if (profile && !profile.is_configured) {
                await updateProfile(user.id, monto);
            } else {
                await createProfile(user.id, monto);
            }

            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(getAuthErrorMessage(err));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="main-container relative w-full min-h-screen bg-[#faf8ff] overflow-hidden [font-family:'Inter-Regular',Helvetica]">
            <div className="flex w-full px-4 md:px-8 py-4 justify-between items-center bg-[rgba(250,248,255,0.8)] relative z-[45]">
                <div className="flex gap-[12px] items-center shrink-0 flex-nowrap relative z-[46]">
                    <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap relative z-[47]">
                        <div className="self-stretch grow shrink-0 basis-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/xak7dXXxwW.png)] bg-cover bg-no-repeat relative overflow-hidden z-[48]" />
                    </div>
                    <div className="flex flex-col items-start shrink-0 flex-nowrap relative z-[49]">
                        <span className="h-[32px] shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] font-bold text-[24px] leading-[32px] text-[#003d9b] tracking-[-0.6px] relative text-left whitespace-nowrap z-50">
                            Solix
                        </span>
                    </div>
                </div>
                <ProfileMenu avatarClassName="h-10 w-10" />
                <div className="hidden md:flex gap-[23.99px] items-center shrink-0 flex-nowrap relative z-[51]">
                    <div className="flex flex-col items-start shrink-0 flex-nowrap relative z-[52]">
                        <span className="h-[24px] shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] font-bold text-[16px] leading-[24px] text-[#434654] tracking-[-0.4px] relative text-left whitespace-nowrap z-[53]">
                            Plataforma de Gestión de Patrimonio
                        </span>
                    </div>
                    <div className="flex w-[32px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col justify-center items-center shrink-0 flex-nowrap rounded-full relative z-[54]">
                        <div className="flex w-[16px] justify-center items-start shrink-0 flex-nowrap relative z-[55]">
                            <div className="w-[16px] h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/EBD9qkw9Yx.png)] bg-cover bg-no-repeat relative z-[56]" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full min-h-[calc(100vh-72px)] px-4 md:px-6 py-8 md:py-14 justify-center items-center relative overflow-hidden">
                <div className="w-[420px] h-[420px] md:w-[600px] md:h-[600px] shrink-0 bg-[rgba(108,248,187,0.2)] rounded-full absolute bottom-[-240px] left-[-120px] z-[2]" />
                <div className="flex w-full max-w-[672px] flex-col gap-[24px] md:gap-[32px] items-start shrink-0 flex-nowrap relative z-[3]">
                    <div className="flex px-6 md:px-16 py-8 md:py-16 flex-col gap-[24px] items-center self-stretch shrink-0 flex-nowrap bg-[#fff] rounded-[32px] md:rounded-[48px] border-solid border border-[rgba(255,255,255,0.5)] relative z-[4]">
                        <div className="shrink-0 bg-[rgba(255,255,255,0)] rounded-[48px] absolute top-[-1px] bottom-[-0.75px] left-[-1px] right-[-1px] shadow-[0_40px_60px_0_rgba(19,27,46,0.06)] z-[5]" />
                        <div className="flex justify-center items-start self-stretch shrink-0 flex-nowrap relative z-[6]">
                            <div className="flex w-[80px] h-[80px] justify-center items-center shrink-0 flex-nowrap bg-[#e2e7ff] rounded-full relative z-[7]">
                                <div className="flex w-[30px] flex-col items-center shrink-0 flex-nowrap relative z-[8]">
                                    <div className="w-[30px] h-[28.5px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/5JcrSBranv.png)] bg-cover bg-no-repeat relative z-[9]" />
                                </div>
                            </div>
                        </div>
                        <div className="flex pt-[16px] pr-0 pb-0 pl-0 flex-col items-center self-stretch shrink-0 flex-nowrap relative z-10">
                            <span className="flex max-w-[491px] justify-center items-center shrink-0 [font-family:'Manrope-Bold',Helvetica] font-bold text-[34px] md:text-[48px] leading-[1.05] text-[#131b2e] tracking-[-1.2px] relative text-center overflow-hidden z-[11]">
                                Bienvenido, configura
                                <br />
                                tu capital inicial
                            </span>
                        </div>
                        <div className="flex w-full max-w-[448px] flex-col items-center shrink-0 flex-nowrap relative z-[12]">
                            <span className="flex w-full max-w-[423px] justify-center items-center shrink-0 [font-family:'Inter-Regular',Helvetica] text-[16px] md:text-[18px] font-normal leading-[1.6] text-[#434654] relative text-center overflow-hidden z-[13]">
                                Ingresa el monto con el que deseas comenzar tu
                                <br />
                                gestión. Este valor solo se configura una vez para
                                <br />
                                establecer tu balance base.
                            </span>
                        </div>
                        <div className="flex pt-[24px] pr-0 pb-0 pl-0 flex-col gap-[32px] items-start self-stretch shrink-0 flex-nowrap relative z-[14]">
                            <div className="flex flex-col gap-[16px] items-start self-stretch shrink-0 flex-nowrap relative z-[15]">
                                <div className="flex pt-[32px] pr-[48px] pb-[32px] pl-[48px] justify-center items-start self-stretch shrink-0 flex-nowrap bg-[#f2f3ff] rounded-[32px] relative overflow-hidden z-[16]">
                                    <div className="flex flex-col items-center grow shrink-0 basis-0 flex-nowrap relative overflow-hidden z-[17]">
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={montoInicial}
                                            onChange={handleMontoChange}
                                            onBlur={handleMontoBlur}
                                            aria-label="Monto inicial"
                                            placeholder="0.00"
                                            className="flex w-full max-w-[220px] h-[82px] justify-center items-center bg-transparent border-none outline-none [font-family:'Manrope-Bold',Helvetica] text-[48px] md:text-[60px] font-bold leading-[1.2] text-[#131b2e] text-center whitespace-nowrap z-[18]"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center self-stretch shrink-0 flex-nowrap relative z-[19]">
                                    <span className="flex w-[100.44px] h-[16px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold leading-[16px] text-[rgba(67,70,84,0.6)] tracking-[0.6px] relative text-center uppercase whitespace-nowrap z-20">
                                        MONTO INICIAL
                                    </span>
                                </div>
                                <div className="flex w-[56px] pt-0 pr-0 pb-0 pl-[24px] items-center shrink-0 flex-nowrap absolute top-0 bottom-0 left-0 z-[21]">
                                    <div className="flex w-auto flex-col items-center shrink-0 flex-nowrap relative z-[22]">
                                        <span className="flex h-[36px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-SemiBold',Helvetica] text-[28px] font-semibold leading-[36px] text-[rgba(0,61,155,0.4)] relative text-center whitespace-nowrap z-[23]">
                                            S/
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-[16px] pr-0 pb-[24px] pl-0 self-stretch shrink-0 relative z-[24] flex flex-col sm:flex-row gap-3 justify-center">
                                <div className="flex pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[8px] items-center flex-nowrap bg-[rgba(234,237,255,0.3)] rounded-[32px] relative z-[25]">
                                    <div className="w-[16px] h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/DO8T9Ni3uF.png)] bg-cover bg-no-repeat relative z-[26]" />
                                    <span className="flex w-[91.25px] h-[16px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold leading-[16px] text-[#434654] relative text-center whitespace-nowrap z-[27]">
                                        Seguridad Total
                                    </span>
                                </div>
                                <div className="flex pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[8px] items-center flex-nowrap bg-[rgba(234,237,255,0.3)] rounded-[32px] relative z-[28]">
                                    <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/vwT64HCRTg.png)] bg-cover bg-no-repeat relative z-[29]" />
                                    <span className="flex w-[86.03px] h-[16px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold leading-[16px] text-[#434654] relative text-center whitespace-nowrap z-30">
                                        Sincronización
                                    </span>
                                </div>
                                <div className="flex pt-[16px] pr-[16px] pb-[16px] pl-[16px] flex-col gap-[8px] items-center flex-nowrap bg-[rgba(234,237,255,0.3)] rounded-[32px] relative z-[31]">
                                    <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/OZmHiZxmAX.png)] bg-cover bg-no-repeat relative z-[32]" />
                                    <span className="flex w-[92.66px] h-[16px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-SemiBold',Helvetica] text-[12px] font-semibold leading-[16px] text-[#434654] relative text-center whitespace-nowrap z-[33]">
                                        Reportes Claros
                                    </span>
                                </div>
                            </div>
                            {error && (
                                <span className="self-stretch text-center [font-family:'Inter-Regular',Helvetica] text-[14px] font-normal leading-[20px] text-[#dc2626] relative z-[34]">
                                    {error}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={handleComenzar}
                                disabled={isSaving}
                                className="flex pt-[20px] pr-[32px] pb-[20px] pl-[32px] gap-[12px] justify-center items-center self-stretch shrink-0 flex-nowrap rounded-full relative z-[34] bg-[linear-gradient(169deg,rgba(0,61,155,1)_0%,rgba(0,82,204,1)_100%)] cursor-pointer"
                            >
                                <div className="flex w-[99.73px] flex-col items-center shrink-0 flex-nowrap relative z-[35]">
                                    <span className="flex w-[99.73px] h-[28px] justify-center items-center shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-[28px] text-[#fff] relative text-center whitespace-nowrap z-[36]">
                                        {isSaving ? "Guardando..." : "Comenzar"}
                                    </span>
                                </div>
                                <div className="flex w-[16px] flex-col items-center shrink-0 flex-nowrap relative z-[37]">
                                    <div className="w-[16px] h-[16px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/djbCppa0G8.png)] bg-cover bg-no-repeat relative z-[38]" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-[7.99px] justify-center items-center self-stretch shrink-0 flex-nowrap relative z-[39] px-2">
                        <div className="flex w-[11.667px] flex-col items-start shrink-0 flex-nowrap relative z-40">
                            <div className="w-[11.667px] h-[11.667px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/pqd5MXEfMC.png)] bg-cover bg-no-repeat relative z-[41]" />
                        </div>
                        <div className="flex flex-col items-start shrink-0 flex-nowrap relative z-[42]">
                            <span className="h-[20px] shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-normal leading-[20px] text-[rgba(67,70,84,0.6)] relative text-left whitespace-nowrap z-[43]">
                                Podrás ajustar los movimientos individuales más tarde.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-[420px] h-[420px] md:w-[600px] md:h-[600px] shrink-0 bg-[rgba(218,226,255,0.2)] rounded-full absolute top-[-210px] md:top-[-300px] right-[-120px] z-[1]" />
            </div>
            <div className="h-[4px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/6ovZ3jptoq.png)] bg-cover bg-no-repeat absolute bottom-0 left-0 right-0 z-[44]" />
        </div>
    );
}