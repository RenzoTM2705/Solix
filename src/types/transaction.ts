export type TransactionType = "ingreso" | "gasto";

export interface Transaction {
    id: string;
    user_id: string;
    fecha: string;
    tipo: TransactionType;
    categoria: string;
    descripcion: string;
    monto: number;
}

export type CreateTransactionInput = Omit<Transaction, "id">;

export type UpdateTransactionInput = Partial<Omit<Transaction, "id" | "user_id">>;
