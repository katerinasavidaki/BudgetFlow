import type { MonthlyStatsDTO } from "@/components/MonthlyBarChart";
import type {TransactionSummaryProps} from "@/components/TransactionSummary.tsx";

export const getMonthlyStats = async (): Promise<MonthlyStatsDTO[]> => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/transactions/stats/monthly", {
        headers: {
            Authorization: `Bearer ${token}`,
        },

    })

    if (!res.ok) throw new Error("Failed to fetch transaction stats");
    return await res.json();
}

export const getMonthTransactionSummary = async (): Promise<TransactionSummaryProps> => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/transactions/stats/summary", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!res.ok) throw new Error("Failed to fetch transaction stats");
    return await res.json();
}