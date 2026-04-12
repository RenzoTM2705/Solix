import { DashboardSidebar } from "../../components/DashboardSidebar.tsx";
import { useTransactions } from "../../hooks/useTransactions";
import { getAuthErrorMessage } from "../../services/auth.service";
import type { Transaction, TransactionType } from "../../types/transaction";
import { useMemo, useState } from "react";

const formatCurrency = (value: number, withSign = false) => {
    const abs = Math.abs(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    if (!withSign) {
        return `S/${abs}`;
    }

    const prefix = value >= 0 ? "+" : "-";
    return `${prefix}S/${abs}`;
};

const parseDate = (fecha: string) => {
    const parsed = new Date(fecha);
    if (Number.isNaN(parsed.getTime())) {
        return { primary: fecha, year: "" };
    }

    const primary = parsed
        .toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
        })
        .replace(".", "")
        .replace(" ", " ");

    return {
        primary: `${primary},`,
        year: String(parsed.getFullYear()),
    };
};

const getCategoryIcon = (tipo: TransactionType) => {
    if (tipo === "ingreso") {
        return {
            wrapperClass: "bg-[rgba(0,108,73,0.1)]",
            iconUrl:
                "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/BxktpAcur9.png",
            labelBg: "bg-[#6cf8bb]",
            labelText: "text-[#00714d]",
            amountText: "text-[#006c49]",
        };
    }

    return {
        wrapperClass: "bg-[rgba(186,26,26,0.1)]",
        iconUrl:
            "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/BEyZymh1HQ.png",
        labelBg: "bg-[#ffdad6]",
        labelText: "text-[#93000a]",
        amountText: "text-[#ba1a1a]",
    };
};

const TABLE_GRID_CLASS = "grid grid-cols-[1.1fr_0.9fr_1.3fr_1.8fr_1fr_0.8fr]";

const TransactionRow = ({
    transaction,
    onEdit,
    disabled,
}: {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    disabled: boolean;
}) => {
    const date = parseDate(transaction.fecha);
    const styles = getCategoryIcon(transaction.tipo);

    return (
        <div className={`${TABLE_GRID_CLASS} items-center self-stretch shrink-0 border-solid border-b border-b-[rgba(195,198,214,0.1)] relative`}>
            <div className="flex w-full pt-[24px] pr-[32px] pb-[25px] pl-[32px] flex-col items-start shrink-0 flex-nowrap relative">
                <span className="flex min-h-[40px] justify-start items-center shrink-0 [font-family:'Inter-Regular',Helvetica] text-[14px] font-normal leading-[20px] text-[#434654] relative text-left overflow-hidden">
                    {date.primary}
                    <br />
                    {date.year}
                </span>
            </div>
            <div className="flex w-full pt-[32.5px] pr-[32px] pb-[32.5px] pl-[32px] flex-col items-start shrink-0 flex-nowrap relative">
                <div className={`flex min-w-[69px] pt-[4px] pr-[12px] pb-[4px] pl-[12px] items-center shrink-0 flex-nowrap rounded-full relative ${styles.labelBg}`}>
                    <span className={`h-[16px] shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold leading-[16px] tracking-[0.6px] relative text-left uppercase whitespace-nowrap ${styles.labelText}`}>
                        {transaction.tipo}
                    </span>
                </div>
            </div>
            <div className="flex w-full pt-0 pr-0 pb-0 pl-[32px] gap-[12px] items-center shrink-0 flex-nowrap relative">
                <div className={`flex w-[30px] h-[32px] justify-center items-center shrink-0 flex-nowrap rounded-full relative ${styles.wrapperClass}`}>
                    <div
                        className="w-[10px] h-[11px] shrink-0 bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url(${styles.iconUrl})` }}
                    />
                </div>
                <div className="flex w-full pr-2 flex-col items-start shrink-0 flex-nowrap relative">
                    <span className="flex min-h-[20px] justify-start items-center shrink-0 [font-family:'Inter-Regular',Helvetica] text-[14px] font-medium leading-[20px] text-[#131b2e] relative text-left overflow-hidden">
                        {transaction.categoria}
                    </span>
                </div>
            </div>
            <div className="flex w-full pt-[24px] pr-[32px] pb-[25px] pl-[63.99px] flex-col items-start shrink-0 flex-nowrap relative">
                <span className="flex min-h-[20px] justify-start items-center shrink-0 [font-family:'Inter-Regular',Helvetica] text-[14px] font-normal leading-[20px] text-[#434654] relative text-left overflow-hidden">
                    {transaction.descripcion}
                </span>
            </div>
            <div className="flex w-full pt-[30.5px] pr-[32px] pb-[30.5px] pl-[32px] flex-col items-end shrink-0 flex-nowrap relative">
                <span className={`flex h-[28px] justify-end items-center shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] text-[18px] font-bold leading-[28px] relative text-right whitespace-nowrap ${styles.amountText}`}>
                    {formatCurrency(transaction.tipo === "ingreso" ? transaction.monto : -transaction.monto, true)}
                </span>
            </div>
            <div className="flex w-full pt-[24px] pr-[24px] pb-[24px] pl-[8px] justify-end items-center shrink-0 flex-nowrap relative">
                <button
                    type="button"
                    onClick={() => onEdit(transaction)}
                    disabled={disabled}
                    className="inline-flex items-center justify-center rounded-full border border-[#c3c6d64d] px-4 py-2 [font-family:'Inter-Regular',Helvetica] text-[12px] font-semibold leading-4 text-[#0052cc] transition-all duration-200 hover:bg-[#f2f3ff] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Editar
                </button>
            </div>
        </div>
    );
};

export const Registros = () => {
    const { data, loading, error, addTransaction, editTransaction } = useTransactions();
    const [actionError, setActionError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const totals = useMemo(() => {
        const ingresos = data
            .filter((item) => item.tipo === "ingreso")
            .reduce((acc, item) => acc + Number(item.monto || 0), 0);

        const gastos = data
            .filter((item) => item.tipo === "gasto")
            .reduce((acc, item) => acc + Number(item.monto || 0), 0);

        return {
            ingresos,
            gastos,
            balance: ingresos - gastos,
        };
    }, [data]);

    const handleAddRegistro = async () => {
        setActionError("");

        const tipoInput = window.prompt("Tipo de movimiento: ingreso o gasto", "gasto");
        if (!tipoInput) {
            return;
        }

        const tipo = tipoInput.toLowerCase().trim();
        if (tipo !== "ingreso" && tipo !== "gasto") {
            setActionError("El tipo debe ser ingreso o gasto.");
            return;
        }

        const categoria = window.prompt("Categoría", "General")?.trim() ?? "";
        if (!categoria) {
            setActionError("La categoría es obligatoria.");
            return;
        }

        const descripcion = window.prompt("Descripción", "")?.trim() ?? "";
        if (!descripcion) {
            setActionError("La descripción es obligatoria.");
            return;
        }

        const montoRaw = window.prompt("Monto (solo número)", "0")?.trim() ?? "";
        const monto = Number(montoRaw);

        if (!Number.isFinite(monto) || monto <= 0) {
            setActionError("El monto debe ser un número mayor que 0.");
            return;
        }

        try {
            await addTransaction({
                fecha: new Date().toISOString(),
                tipo,
                categoria,
                descripcion,
                monto,
            });
        } catch (err) {
            setActionError(getAuthErrorMessage(err));
        }
    };

    const handleEditRegistro = async (transaction: Transaction) => {
        setActionError("");

        const tipoInput = window
            .prompt("Tipo de movimiento: ingreso o gasto", transaction.tipo)
            ?.toLowerCase()
            .trim();

        if (!tipoInput) {
            return;
        }

        if (tipoInput !== "ingreso" && tipoInput !== "gasto") {
            setActionError("El tipo debe ser ingreso o gasto.");
            return;
        }

        const categoria = window.prompt("Categoría", transaction.categoria)?.trim() ?? "";
        if (!categoria) {
            setActionError("La categoría es obligatoria.");
            return;
        }

        const descripcion = window.prompt("Descripción", transaction.descripcion)?.trim() ?? "";
        if (!descripcion) {
            setActionError("La descripción es obligatoria.");
            return;
        }

        const montoRaw = window.prompt("Monto (solo número)", String(transaction.monto))?.trim() ?? "";
        const monto = Number(montoRaw);

        if (!Number.isFinite(monto) || monto <= 0) {
            setActionError("El monto debe ser un número mayor que 0.");
            return;
        }

        setEditingId(transaction.id);

        try {
            await editTransaction(transaction.id, {
                tipo: tipoInput,
                categoria,
                descripcion,
                monto,
            });
        } catch (err) {
            setActionError(getAuthErrorMessage(err));
        } finally {
            setEditingId(null);
        }
    };

    return (
        <div className="main-container relative flex w-full min-h-screen flex-col items-start bg-[#faf8ff] overflow-x-hidden [font-family:'Inter-Regular',Helvetica]">
            <DashboardSidebar />
            <div className="flex min-h-screen w-full pt-0 pr-0 pb-[2px] pl-0 flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[47] lg:w-[calc(100%-288px)] lg:ml-[288px]">
                <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 self-stretch shrink-0 flex-nowrap bg-[rgba(250,248,255,0.8)] relative z-[48]">
                    <div className="flex w-full pt-0 pr-0 pb-0 pl-0 items-center shrink-0 flex-nowrap relative z-[49] sm:w-auto sm:pr-[32px]">
                        <div className="flex w-[102.88px] gap-[12px] items-center shrink-0 flex-nowrap relative z-50">
                            <div className="w-[32px] h-[32px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/kMiBtgf6O5.png)] bg-cover bg-no-repeat relative overflow-hidden z-[51]" />
                            <div className="flex w-[58.88px] flex-col items-start shrink-0 flex-nowrap relative z-[52]">
                                <span className="h-[32px] shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] text-[24px] font-bold leading-[32px] text-[#003d9b] relative text-left whitespace-nowrap z-[53]">
                                    Solix
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full gap-[12px] items-center justify-between shrink-0 flex-nowrap relative z-[54] sm:w-auto sm:gap-[24px] sm:justify-start">
                        <div className="flex w-full flex-col items-start shrink-0 flex-nowrap relative z-[55] sm:w-[256px]">
                            <div className="flex w-full pt-[6px] pr-[16px] pb-[7px] pl-[40px] justify-center items-start shrink-0 flex-nowrap bg-[#f2f3ff] rounded-full relative overflow-hidden z-[56]">
                                <div className="flex flex-col items-start grow shrink-0 basis-0 flex-nowrap relative overflow-hidden z-[57]">
                                    <span className="h-[19px] self-stretch shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] text-[14px] font-medium leading-[19px] text-[#6b7280] tracking-[-0.35px] relative text-left whitespace-nowrap z-[58]">
                                        Buscar transacciones...
                                    </span>
                                </div>
                            </div>
                            <div className="flex w-[18px] h-[24px] flex-col items-start shrink-0 flex-nowrap absolute top-[12.5%] left-[12px] z-[59]">
                                <div className="w-[18px] h-[18px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/aZJvn3mY54.png)] bg-cover bg-no-repeat relative z-[60]" />
                            </div>
                        </div>
                        <div className="flex w-[32px] pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col justify-center items-center shrink-0 flex-nowrap rounded-full relative z-[61]">
                            <div className="flex w-[16px] justify-center items-start shrink-0 flex-nowrap relative z-[62]">
                                <div className="w-[16px] h-[20px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/AfdAwGr5cL.png)] bg-cover bg-no-repeat relative z-[63]" />
                            </div>
                        </div>
                        <div className="flex w-[32px] h-[32px] flex-col items-start shrink-0 flex-nowrap bg-[rgba(255,255,255,0)] rounded-full border-2 border-[rgba(0,82,204,0.2)] relative overflow-hidden shadow-[0_0_0_0_#dae2ff] z-[64]">
                            <div className="w-[32px] h-[32px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/GtEyW4VDxX.png)] bg-cover bg-no-repeat relative overflow-hidden z-[65]" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 items-start self-stretch shrink-0 flex-nowrap relative z-[66]">
                    <div className="flex flex-col gap-4 self-stretch shrink-0 flex-nowrap relative z-[67] sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex w-full flex-col gap-[8px] items-start shrink-0 flex-nowrap relative z-[68] sm:w-auto sm:max-w-[620px]">
                            <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[69]">
                                <span className="shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] text-[28px] sm:text-[34px] font-bold leading-[34px] sm:leading-[40px] text-[#131b2e] tracking-[-0.9px] relative text-left z-[70]">
                                    Registro de Transacciones
                                </span>
                            </div>
                            <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[71]">
                                <span className="h-[24px] shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[16px] font-normal leading-[24px] text-[#434654] relative text-left whitespace-nowrap z-[72]">
                                    Gestione y supervise sus movimientos financieros con
                                    precisión.
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddRegistro}
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#003d9b] px-6 py-3 text-white shadow-[0_8px_10px_0_rgba(0,61,155,0.25)] transition-all duration-200 hover:bg-[#0052cc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003d9b]"
                        >
                            <span className="[font-family:'Inter-Regular',Helvetica] text-[16px] font-bold leading-6">
                                Agregar Registro
                            </span>
                        </button>
                    </div>

                    {(error || actionError) && (
                        <p className="[font-family:'Inter-Regular',Helvetica] text-sm text-[#dc2626]">
                            {actionError || error}
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 self-stretch shrink-0 relative z-[73]">
                        <div className="flex flex-col gap-[8px] items-start bg-[#fff] rounded-[32px] p-6 border-solid border border-[rgba(195,198,214,0.1)] relative shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] z-[74]">
                            <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[75]">
                                <span className="h-[20px] self-stretch shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] text-[#434654] tracking-[0.7px] relative text-left uppercase whitespace-nowrap z-[76]">
                                    BALANCE TOTAL
                                </span>
                            </div>
                            <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[77]">
                                <span className="h-[36px] self-stretch shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#003d9b] relative text-left whitespace-nowrap z-[78]">
                                    {formatCurrency(totals.balance)}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px] items-start bg-[#fff] rounded-[32px] p-6 border-solid border border-[rgba(195,198,214,0.1)] relative shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] z-[79]">
                            <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[80]">
                                <span className="h-[20px] self-stretch shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] text-[#434654] tracking-[0.7px] relative text-left uppercase whitespace-nowrap z-[81]">
                                    INGRESOS MENSUALES
                                </span>
                            </div>
                            <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[82]">
                                <span className="h-[36px] self-stretch shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#006c49] relative text-left whitespace-nowrap z-[83]">
                                    {formatCurrency(totals.ingresos, true)}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px] items-start bg-[#fff] rounded-[32px] p-6 border-solid border border-[rgba(195,198,214,0.1)] relative shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] z-[84]">
                            <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[85]">
                                <span className="h-[20px] self-stretch shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] text-[#434654] tracking-[0.7px] relative text-left uppercase whitespace-nowrap z-[86]">
                                    GASTOS MENSUALES
                                </span>
                            </div>
                            <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[87]">
                                <span className="h-[36px] self-stretch shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] text-[32px] font-bold leading-9 text-[#ba1a1a] relative text-left whitespace-nowrap z-[88]">
                                    {formatCurrency(-totals.gastos, true)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap bg-[#fff] rounded-[32px] border-solid border border-[rgba(195,198,214,0.1)] relative overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] z-[89]">
                        <div className="flex pt-[24px] pr-[32px] pb-[24px] pl-[32px] justify-between items-center self-stretch shrink-0 flex-nowrap bg-[rgba(242,243,255,0.5)] relative z-[90]">
                            <div className="flex w-[164.28px] flex-col items-start shrink-0 flex-nowrap relative z-[91]">
                                <span className="h-[28px] shrink-0 basis-auto [font-family:'Manrope-Bold',Helvetica] text-[20px] font-bold leading-[28px] text-[#131b2e] relative text-left whitespace-nowrap z-[92]">
                                    Actividad Reciente
                                </span>
                            </div>
                            <div className="flex w-[149.693px] gap-[16px] items-start shrink-0 flex-nowrap relative z-[93]">
                                <div className="flex w-[58.23px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[94]">
                                    <div className="flex w-[10.5px] flex-col items-center shrink-0 flex-nowrap relative z-[95]">
                                        <div className="w-[10.5px] h-[7px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/VJYcxW5iNX.png)] bg-cover bg-no-repeat relative z-[96]" />
                                    </div>
                                    <span className="flex w-[39.73px] h-[20px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] text-[#434654] relative text-center whitespace-nowrap z-[97]">
                                        Filtrar
                                    </span>
                                </div>
                                <div className="flex w-[75.463px] gap-[8px] items-center shrink-0 flex-nowrap relative z-[98]">
                                    <div className="flex w-[9.333px] flex-col items-center shrink-0 flex-nowrap relative z-[99]">
                                        <div className="w-[9.333px] h-[9.333px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/rGTigOR2Nd.png)] bg-cover bg-no-repeat relative z-[100]" />
                                    </div>
                                    <span className="flex w-[58.13px] h-[20px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-semibold leading-[20px] text-[#434654] relative text-center whitespace-nowrap z-[101]">
                                        Exportar
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <div className="flex min-w-[960px] flex-col gap-[-1px] items-start self-stretch shrink-0 flex-nowrap relative z-[102]">
                                <div className={`${TABLE_GRID_CLASS} items-start self-stretch shrink-0 border-solid border-t border-t-[rgba(195,198,214,0.1)] relative z-[103]`}>
                                    <div className="flex w-full pt-[20px] pr-[32px] pb-[20px] pl-[32px] flex-col items-start shrink-0 flex-nowrap relative z-[104]">
                                        <span className="h-[16px] shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold leading-[16px] text-[#434654] tracking-[0.6px] relative text-left uppercase whitespace-nowrap z-[105]">
                                            Fecha
                                        </span>
                                    </div>
                                    <div className="flex w-full pt-[20px] pr-[32px] pb-[20px] pl-[32px] flex-col items-start shrink-0 flex-nowrap relative z-[106]">
                                        <span className="h-[16px] shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold leading-[16px] text-[#434654] tracking-[0.6px] relative text-left uppercase whitespace-nowrap z-[107]">
                                            Tipo
                                        </span>
                                    </div>
                                    <div className="flex w-full pt-[20px] pr-[32px] pb-[20px] pl-[32px] flex-col items-start shrink-0 flex-nowrap relative z-[108]">
                                        <span className="h-[16px] shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold leading-[16px] text-[#434654] tracking-[0.6px] relative text-left uppercase whitespace-nowrap z-[109]">
                                            Categoría
                                        </span>
                                    </div>
                                    <div className="flex w-full pt-[20px] pr-[32px] pb-[20px] pl-[32px] flex-col items-start shrink-0 flex-nowrap relative z-[110]">
                                        <span className="h-[16px] shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold leading-[16px] text-[#434654] tracking-[0.6px] relative text-left uppercase whitespace-nowrap z-[111]">
                                            Descripción
                                        </span>
                                    </div>
                                    <div className="flex w-full pt-[20px] pr-[32px] pb-[20px] pl-[32px] flex-col items-end shrink-0 flex-nowrap relative z-[112]">
                                        <span className="flex w-[45.47px] h-[16px] justify-end items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold leading-[16px] text-[#434654] tracking-[0.6px] relative text-right uppercase whitespace-nowrap z-[113]">
                                            Monto
                                        </span>
                                    </div>
                                    <div className="flex w-full pt-[20px] pr-[24px] pb-[20px] pl-[8px] flex-col items-end shrink-0 flex-nowrap relative">
                                        <span className="h-[16px] shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[12px] font-bold leading-[16px] text-[#434654] tracking-[0.6px] relative text-right uppercase whitespace-nowrap">
                                            Acciones
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-[-1px] items-start self-stretch shrink-0 flex-nowrap relative z-[114]">
                                    {loading ? (
                                        <div className={`${TABLE_GRID_CLASS} items-center self-stretch shrink-0 border-solid border-b border-b-[rgba(195,198,214,0.1)] relative`}>
                                            <div className="col-span-6 px-8 py-8 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                                Cargando transacciones...
                                            </div>
                                        </div>
                                    ) : data.length === 0 ? (
                                        <div className={`${TABLE_GRID_CLASS} items-center self-stretch shrink-0 border-solid border-b border-b-[rgba(195,198,214,0.1)] relative`}>
                                            <div className="col-span-6 px-8 py-8 [font-family:'Inter-Regular',Helvetica] text-[14px] text-[#434654]">
                                                Aún no tienes transacciones registradas.
                                            </div>
                                        </div>
                                    ) : (
                                        data.map((transaction) => (
                                            <TransactionRow
                                                key={transaction.id}
                                                transaction={transaction}
                                                onEdit={handleEditRegistro}
                                                disabled={editingId === transaction.id}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex px-4 py-4 sm:px-8 sm:py-6 flex-col gap-3 sm:flex-row sm:justify-between sm:items-center self-stretch shrink-0 flex-nowrap bg-[rgba(242,243,255,0.2)] relative z-[179]">
                            <div className="flex w-full sm:w-[234.08px] flex-col items-start shrink-0 flex-nowrap relative z-[180]">
                                <span className="h-[20px] shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[14px] font-medium leading-[20px] text-[#434654] relative text-left whitespace-nowrap z-[181]">
                                    Mostrando {data.length} transacciones
                                </span>
                            </div>
                            <div className="flex w-full sm:w-[232px] gap-[8px] items-start justify-center sm:justify-start shrink-0 flex-nowrap relative z-[182]">
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[183]">
                                    <div className="flex w-[7.4px] flex-col items-center shrink-0 flex-nowrap relative z-[184]">
                                        <div className="w-[7.4px] h-[12px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/ySHF1wAAtB.png)] bg-cover bg-no-repeat relative z-[185]" />
                                    </div>
                                </div>
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap bg-[#0052cc] rounded-full relative z-[186]">
                                    <span className="flex w-[6.91px] h-[24px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[16px] font-bold leading-[24px] text-[#fff] relative text-center whitespace-nowrap z-[187]">
                                        1
                                    </span>
                                </div>
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[188]">
                                    <span className="flex w-[9.77px] h-[24px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[16px] font-normal leading-[24px] text-[#434654] relative text-center whitespace-nowrap z-[189]">
                                        2
                                    </span>
                                </div>
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[190]">
                                    <span className="flex w-[9.89px] h-[24px] justify-center items-center shrink-0 basis-auto [font-family:'Inter-Regular',Helvetica] text-[16px] font-normal leading-[24px] text-[#434654] relative text-center whitespace-nowrap z-[191]">
                                        3
                                    </span>
                                </div>
                                <div className="flex w-[40px] h-[40px] justify-center items-center shrink-0 flex-nowrap rounded-full border-solid border border-[rgba(195,198,214,0.3)] relative z-[192]">
                                    <div className="flex w-[7.4px] flex-col items-center shrink-0 flex-nowrap relative z-[193]">
                                        <div className="w-[7.4px] h-[12px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2026-04-12/1RJYiJee7R.png)] bg-cover bg-no-repeat relative z-[194]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
