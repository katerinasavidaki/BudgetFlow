import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Banknote, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import type {TransactionSummaryProps} from "@/components/TransactionSummary.tsx";

interface Props {
    summary: TransactionSummaryProps;
}

const StatsSnapshot = ({ summary }: Props) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    const stats = [
        {
            label: "Total Income",
            value: `${summary.totalIncome} €`,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            label: "Total Expenses",
            value: `${summary.totalExpense} €`,
            icon: TrendingDown,
            color: "text-red-600",
            bg: "bg-red-100",
        },
        {
            label: "Balance",
            value: `${summary.balance} €`,
            icon: Banknote,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            label: "Transactions",
            value: `${summary.totalTransactions}`,
            icon: BarChart3,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
    ];

    return (
        <div
            className={cn(
                "grid gap-4 sm:grid-cols-2 md:grid-cols-4 mt-10 transition-opacity duration-500",
                animate ? "opacity-100" : "opacity-0"
            )}
        >
            {stats.map((stat) => (
                <Card key={stat.label} className="p-4 flex items-center gap-4 shadow-sm">
                    <div
                        className={cn(
                            "rounded-full p-2",
                            stat.bg,
                            stat.color,
                            "text-lg"
                        )}
                    >
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className={`font-semibold text-base ${stat.color}`}>{stat.value}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default StatsSnapshot;
