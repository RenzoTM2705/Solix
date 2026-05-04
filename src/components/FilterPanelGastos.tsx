import { useState } from "react";
import type { GastosFilters } from "../utils/gastosFilters";

interface FilterPanelGastosProps {
    filters: GastosFilters;
    onFiltersChange: (filters: GastosFilters) => void;
    onResetFilters?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export const FilterPanelGastos = ({
    filters,
    onFiltersChange,
    onResetFilters,
    isOpen = false,
    onClose,
}: FilterPanelGastosProps) => {
    const [customAmountMin, setCustomAmountMin] = useState("");
    const [customAmountMax, setCustomAmountMax] = useState("");

    const handleEstadoChange = (estado: GastosFilters["estado"]) => {
        onFiltersChange({ ...filters, estado });
    };

    const handleDateRangeChange = (range: GastosFilters["dateRange"]) => {
        if (range === "all") {
            onFiltersChange({
                ...filters,
                dateRange: range,
                dateStart: undefined,
                dateEnd: undefined,
            });
            return;
        }

        onFiltersChange({
            ...filters,
            dateRange: range,
            dateStart: undefined,
            dateEnd: undefined,
        });
    };

    const handleAmountFilterChange = (filter: GastosFilters["amountFilter"]) => {
        onFiltersChange({ ...filters, amountFilter: filter });
    };

    const handleCategoryChange = (value: string) => {
        onFiltersChange({ ...filters, categoria: value });
    };

    const handleCustomAmountApply = () => {
        if (customAmountMin && customAmountMax) {
            onFiltersChange({
                ...filters,
                amountFilter: "custom",
                amountMin: Number(customAmountMin),
                amountMax: Number(customAmountMax),
            });
        }
    };

    const handleResetFilters = () => {
        setCustomAmountMin("");
        setCustomAmountMax("");
        onResetFilters?.();
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
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="self-end rounded-full border border-[rgba(195,198,214,0.5)] px-3 py-2 text-xs font-semibold text-[#434654] hover:bg-[#f2f3ff]"
                    >
                        Reiniciar filtros
                    </button>

                    {/* Estado - OBLIGATORIO */}
                    <div className="flex flex-col gap-3">
                        <label className="font-semibold text-[#131b2e] flex items-center gap-2 text-sm">
                            Estado
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["all", "pendiente", "pagado"] as const).map((estado) => (
                                <button
                                    key={estado}
                                    type="button"
                                    onClick={() => handleEstadoChange(estado)}
                                    className={`px-3 py-2 rounded-full font-semibold text-xs transition-colors ${
                                        filters.estado === estado
                                            ? "bg-[#003d9b] text-white"
                                            : "bg-[#f2f3ff] text-[#003d9b] hover:bg-[#e1e7ff]"
                                    }`}
                                >
                                    {estado === "all" && "Todos"}
                                    {estado === "pendiente" && "Pendiente"}
                                    {estado === "pagado" && "Pagado"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fecha programada */}
                    <div className="flex flex-col gap-3">
                        <label className="font-semibold text-[#131b2e] flex items-center gap-2 text-sm">
                            Fecha programada
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(["all", "today", "thisWeek", "overdue", "next7"] as const).map((range) => (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => handleDateRangeChange(range)}
                                    className={`px-3 py-2 rounded-full font-semibold text-xs transition-colors ${
                                        filters.dateRange === range
                                            ? "bg-[#003d9b] text-white"
                                            : "bg-[#f2f3ff] text-[#003d9b] hover:bg-[#e1e7ff]"
                                    }`}
                                >
                                    {range === "all" && "Todas"}
                                    {range === "today" && "Hoy"}
                                    {range === "thisWeek" && "Esta semana"}
                                    {range === "overdue" && "Vencidos"}
                                    {range === "next7" && "Próximos 7"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Monto */}
                    <div className="flex flex-col gap-3">
                        <label className="font-semibold text-[#131b2e] flex items-center gap-2 text-sm">
                            Categoría
                        </label>
                        <input
                            type="text"
                            value={filters.categoria || ""}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            placeholder="Buscar por categoría"
                            className="px-3 py-2 rounded-full border border-[#c3c6d64d] text-sm"
                        />
                    </div>

                    {/* Monto */}
                    <div className="flex flex-col gap-3">
                        <label className="font-semibold text-[#131b2e] flex items-center gap-2 text-sm">
                            Monto
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["all", "low", "high"] as const).map((filter) => (
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
                                    {filter === "low" && "Bajos"}
                                    {filter === "high" && "Altos"}
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
