import axios from "axios";
import {z} from "zod";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const TransactionType = z.enum(["INCOME", "EXPENSE"]);
export const TransactionCategory = z.enum(["FOOD", "TRANSPORT", "RENT", "SHOPPING", "HEALTH",
    "EDUCATION", "TRAVEL", "UTILITIES", "ENTERTAINMENT", "OTHER"]);
export const TransactionMethod = z.enum(["CASH", "CARD", "BANK_TRANSFER", "OTHER"]);


export const addTransactionSchema = z.object({
    description: z.string().min(1, { message: "Description is required" }),
    amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number",
    }),
    date: z.string().min(1, { message: "Date is required" }),
    type: TransactionType,
    category: TransactionCategory,
    paymentMethod: TransactionMethod,
});

export type TransactionFormValues = z.infer<typeof addTransactionSchema>;

export const createTransactionApi = async (data: TransactionFormValues): Promise<void> => {
    const token = localStorage.getItem("token");

    await axios.post(`${API_URL}/transactions`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};