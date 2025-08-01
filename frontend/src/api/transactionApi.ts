import axios from "axios";
import {z} from "zod";
import type {TransactionFilterValues} from "@/components/TransactionFilters.tsx";
import {transactionCategoryOptions, transactionMethodOptions, transactionTypeOptions} from "@/api/enumHelpers.ts";
import type {TransactionType as EnumTransactionType} from "@/api/enumHelpers.ts";
import type {TransactionCategory as EnumTransactionCategory} from "@/api/enumHelpers.ts";
import type {TransactionMethod as EnumTransactionMethod} from "@/api/enumHelpers.ts";



const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export type TransactionDTO = {
    id: number;
    amount: number;
    description: string;
    category: string; // enum
    type: string;     // enum
    paymentMethod: string;   // enum
    date: string;     // format: yyyy-MM-dd
};

export const TransactionType = z.enum(["INCOME", "EXPENSE"]);
export const TransactionCategory = z.enum(["FOOD", "TRANSPORT", "RENT", "SHOPPING", "HEALTH",
    "EDUCATION", "TRAVEL", "UTILITIES", "ENTERTAINMENT", "OTHER"]);
export const TransactionMethod = z.enum(["CASH", "CARD", "BANK_TRANSFER", "OTHER"]);


export const addTransactionSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
    amount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Amount must be a positive number",
        }),
    date: z.string().min(1, { message: "Date is required" }),
    type: TransactionType,
    category: TransactionCategory,
    paymentMethod: TransactionMethod,
});

export const updateTransactionSchema = z.object({
    id: z.number().int().positive({ message: "Invalid transaction ID" }),
    description: z.string().min(1, { message: "Description is required" }),
    amount:z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Amount must be a positive number",
        }),
    date: z.string().min(1, { message: "Date is required" }),
    type: z.enum(transactionTypeOptions.map(opt => opt.value) as [EnumTransactionType, ...EnumTransactionType[]]),
    category: z.enum(transactionCategoryOptions.map(opt => opt.value) as [EnumTransactionCategory, ...EnumTransactionCategory[]]),
    paymentMethod: z.enum(transactionMethodOptions.map(opt => opt.value) as [EnumTransactionMethod, ...EnumTransactionMethod[]]),
});

export type EditTransactionForm = z.infer<typeof updateTransactionSchema>;

export type TransactionFormValues = z.infer<typeof addTransactionSchema>;

export const createTransactionApi = async (data: TransactionFormValues): Promise<void> => {
    const token = localStorage.getItem("token");

    await axios.post(`${API_URL}/transactions`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getTransactions = async (filters: TransactionFilterValues): Promise<TransactionDTO[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    const response = await axios.post("http://localhost:8080/api/transactions/filter", filters, {
        headers: { Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
        },
    });

    return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:8080/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getTransactionById = async (id: number): Promise<TransactionDTO> => {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // or AuthContext
        },
    });
    if (!response.ok) throw new Error("Failed to fetch transaction");
    return await response.json();
};

export const updateTransaction = async (dto: TransactionDTO): Promise<TransactionDTO> => {
    const response = await fetch(`${API_URL}/transactions`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Failed to update transaction");
    return await response.json();
};