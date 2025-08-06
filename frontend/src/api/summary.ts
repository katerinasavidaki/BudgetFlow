import type {TransactionSummaryProps} from "@/components/TransactionSummary.tsx";


export async function getTransactionSummary(): Promise<TransactionSummaryProps> {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/api/transactions/summary", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch transaction summary");
    }

    return res.json();
}