import { Pie } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend);

type ExpenseStatsByCategory = {
    category: string;
    totalAmount: number;
    type: string;
}

type Props = {
    data: ExpenseStatsByCategory[];
}

export default function ExpenseCategoryPieChart({ data }: Props) {


    const chartData = {
        labels: data.map((entry) => entry.category),
        datasets: [
            {
                label: "Expenses",
                data: data.map((entry) => entry.totalAmount),
                backgroundColor: [
                    "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#C084FC", "#F472B6",
                ],
                borderColor: "#ffffff",
                borderWidth: 1,
            },
        ],
    };


    if (data.length === 0) return <p className="text-center text-gray-500">No data available for expenses by category.</p>

    return (
        <div className="w-full md:w-1/2 mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Expenses by category distribution</h2>
            <Pie data={chartData} />
        </div>
    );
}
