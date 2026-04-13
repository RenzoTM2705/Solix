import { useState } from "react";
import type { RegistrosFilters } from "../utils/registrosFilters";

interface FilterPanelRegistrosProps {
    filters: RegistrosFilters;
    onFiltersChange: (filters: RegistrosFilters) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export const FilterPanelRegistros = ({
    filters,
    onFiltersChange,
    isOpen = false,
    onClose,
}: FilterPanelRegistrosProps) => {
    const [customDateStart, setCustomDateStart] = useState("");
    const [customDateEnd, setCustomDateEnd] = useState("");
    const [customAmountMin, setCustomAmountMin] = useState("");
    const [customAmountMax, setCustomAmountMax] = useState("");

    const handleDateRangeChange = (range: RegistrosFilters["dateRange"]) => {
        onFiltersChange({ ...filters, dateRange: range });
    };

    const handleTypeChange = (type: RegistrosFilters["type"]) => {
        onFiltersChange({ ...filters, type });
    };

    const handleAmountFilterChange = (filter: RegistrosFilters["amountFilter"]) => {
        onFiltersChange({ ...filters, amountFilter: filter });
    };

    const handleCustomDateApply = () => {
        if (!customDateStart || !customDateEnd) return;
        onFiltersChange({
            ...filters,
            dateRange: "custom",
            dateStart: new Date(customDateStart),
            dateEnd: new Date(customDateEnd),
        });
    };

    const handleCustomAmountApply = () => {
        if (!customAmountMin || !customAmountMax) return;
        onFiltersChange({
            ...filters,
            amountFilter: "custom",
            amountMin: Number(customAmountMin),
            amountMax: Number(customAmountMax),
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* OVERLAY */}
            <div
                className="fixed inset-0 z-[9998]"
                onClick={onClose}
                style={{ background: "transparent" }}
            />

            {/* PANEL */}
            <div
                className="absolute top-full right-0 mt-2 z-[99999] w-[min(320px,calc(100vw-2rem))] rounded-[16px] border border-[#c3c6d64d] shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden"
                style={{ backgroundColor: "#FFFFFF" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col gap-4 p-6 max-h-[75vh] overflow-y-auto">
                    {/* FECHA */}
                    <div className="flex flex-col gap-3">
                        <label className="font-semibold text-[#131b2e] text-sm">
                            Fecha
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(["today", "last7", "thisMonth"] as const).map((range) => (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => handleDateRangeChange(range)}
                                    className={`px-3 py-2 rounded-full font-semibold text-sm transition-colors ${
                                        filters.dateRange === range
                                            ? "bg-[#003d9b] text-white"
                                            : "bg-[#f2f3ff] text-[#003d9b] hover:bg-[#e1e7ff]"
                                    }`}
                                >
                                    {range === "today" && "Hoy"}
                                    {range === "last7" && "Últimos 7"}
                                    {range === "thisMonth" && "Este mes"}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleDateRangeChange("custom")}
                                className={`col-span-2 px-3 py-2 rounded-full font-semibold text-sm transition-colors ${
                                    filters.dateRange === "custom"
                                        ? "bg-[#003d9b] text-white"
                                        : "bg-[#f2f3ff] text-[#003d9b] hover:bg-[#e1e7ff]"
                                }`}
                            >
                                Personalizado
                            </button>
                        </div>
                        {filters.dateRange === "custom" && (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="date"
                                    value={customDateStart}
                                    onChange={(e) => setCustomDateStart(e.target.value)}
                                    className="px-3 py-2 rounded-full border border-[#c3c6d64d] text-sm"
                                />
                                <input
                                    type="date"
                                    value={customDateEnd}
                                    onChange={(e) => setCustomDateEnd(e.target.value)}
                                    className="px-3 py-2 rounded-full border border-[#c3c6d64d] text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleCustomDateApply}
                                    className="px-3 py-2 rounded-full bg-[#003d9b] text-white text-sm font-semibold"
                                >
                                    Aplicar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* TIPO */}
                    <div className="flex flex-col gap-3">
                        <label className="font-semibold text-[#131b2e] text-sm">
                            Tipo
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["all", "ingreso", "gasto"] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleTypeChange(type)}
                                    className={`px-3 py-2 rounded-full font-semibold text-xs transition-colors ${
                                        filters.type === type
                                            ? "bg-[#003d9b] text-white"
                                            : "bg-[#f2f3ff] text-[#003d9b] hover:bg-[#e1e7ff]"
                                    }`}
                                >
                                    {type === "all" && "Ambos"}
                                    {type === "ingreso" && "Ingresos"}
                                    {type === "gasto" && "Gastos"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MONTO */}
                    <div className="flex flex-col gap-3">
                        <label className="font-semibold text-[#131b2e] text-sm">
                            Monto
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["all", "under50", "over100"] as const).map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => handleAmountFilterChange(filter)}
                                    className={`px-3 py-2 rounded-full font-semibold text-xs transition-colors ${
                                        filters.amountFilter === filter
                                            ? "bg-[#003d9b] text-white"
                                            : "bg-[#f2f3ff] text-[#003d9b] hover:bg-[#e1e7ff]"
                                    }`}
                                >
                                    {filter === "all" && "Todos"}
                                    {filter === "under50" && "< S/50"}
                                    {filter === "over100" && "> S/100"}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => handleAmountFilterChange("custom")}
                            className={`px-3 py-2 rounded-full font-semibold text-sm transition-colors ${
                                filters.amountFilter === "custom"
                                    ? "bg-[#003d9b] text-white"
                                    : "bg-[#f2f3ff] text-[#003d9b] hover:bg-[#e1e7ff]"
                            }`}
                        >
                            Rango personalizado
                        </button>
                        {filters.amountFilter === "custom" && (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="number"
                                    placeholder="Mín"
                                    value={customAmountMin}
                                    onChange={(e) => setCustomAmountMin(e.target.value)}
                                    className="px-3 py-2 rounded-full border border-[#c3c6d64d] text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Máx"
                                    value={customAmountMax}
                                    onChange={(e) => setCustomAmountMax(e.target.value)}
                                    className="px-3 py-2 rounded-full border border-[#c3c6d64d] text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleCustomAmountApply}
                                    className="px-3 py-2 rounded-full bg-[#003d9b] text-white text-sm font-semibold"
                                >
                                    Aplicar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
