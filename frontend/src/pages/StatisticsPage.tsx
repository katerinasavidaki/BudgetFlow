import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth.ts";
import BarChart from "@/components/MonthlyBarChart";
import PieChart from "@/components/ExpenseCategoryPieChart";
import {toast} from "sonner";

type MonthlyStats = {
    month: number;
    totalIncome: number;
    totalExpense: number;
}

type CategoryStats = {
    category: string;
    totalAmount: number;
    type: string;
}

export default function StatsPage() {
    const { token } = useAuth();
    const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [monthlyRes, categoryRes] = await Promise.all([
                    axios.get<MonthlyStats[]>(
                        "http://localhost:8080/api/transactions/stats/monthly",
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    ),
                    axios.get<CategoryStats[]>(
                        "http://localhost:8080/api/transactions/stats/by-category",
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    ),
                ]);

                setMonthlyData(monthlyRes.data);
                setCategoryData(categoryRes.data);
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Error fetching stats");
                console.error("Error fetching stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    if (loading) {
        return <p className="text-center mt-6">Loading...</p>;
    }

    const hasMonthlyData = monthlyData.length > 0;
    const hasCategoryData = categoryData.length > 0;

    if (!hasMonthlyData && !hasCategoryData) {
        return <p className="text-center text-gray-500 mt-8">No data available.</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center mt-20 space-y-8">
            <h1 className="text-2xl font-bold text-center mb-6">Transaction Statistics</h1>

            <div className="w-full max-w-md mx-auto">
                {hasMonthlyData && (
                    <div className="mb-8">
                        <BarChart data={monthlyData} />
                    </div>
                )}
            </div>

            <div className="w-full max-w-md mx-auto">
                {hasCategoryData && (
                    <div>
                        <PieChart data={categoryData} />
                    </div>
                )}
            </div>
        </div>
    );
}
