import type { MonthlyStatsDTO } from "@/components/MonthlyBarChart";


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