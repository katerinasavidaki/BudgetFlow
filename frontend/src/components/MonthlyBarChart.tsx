import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Legend, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export type MonthlyStatsDTO = {
    month: number;
    totalIncome: number;
    totalExpense: number;
};

type Props = {
    data: MonthlyStatsDTO[];
};

const monthLabels = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function MonthlyBarChart({ data }: Props) {
    const chartData = {
        labels: data.map((d) => monthLabels[d.month]),
        datasets: [
            {
                label: "Income",
                data: data.map((d) => d.totalIncome),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "Expenses",
                data: data.map((d) => d.totalExpense),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    return <Bar data={chartData} />;
}
