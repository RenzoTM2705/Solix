export interface ScheduledTransaction {
    id: string;
    user_id: string;
    descripcion: string;
    categoria: string;
    monto: number;
    fecha_programada: string;
    estado: "pendiente" | "pagado";
}

export type CreateScheduledTransactionInput = Omit<ScheduledTransaction, "id">;

export type UpdateScheduledTransactionInput = Partial<Omit<ScheduledTransaction, "id" | "user_id">>;
