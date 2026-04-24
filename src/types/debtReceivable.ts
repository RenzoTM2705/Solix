// Tipos base para las deudas por cobrar del usuario.
export type DebtReceivableStatus = "pendiente" | "pagado";

export interface DebtReceivable {
    id: string;
    user_id: string;
    nombre_persona: string;
    descripcion: string;
    monto: number;
    fecha_prestamo: string;
    estado: DebtReceivableStatus;
    created_at: string;
}

export type CreateDebtReceivableInput = Omit<DebtReceivable, "id" | "created_at">;

export type UpdateDebtReceivableInput = Partial<Omit<DebtReceivable, "id" | "user_id" | "created_at">>;