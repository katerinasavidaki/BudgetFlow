import { useEffect, useRef, useState } from "react";
import type { TransactionDTO } from "@/api/transactionApi.ts";
import TransactionTable from "@/components/TransactionTable";
import TransactionFilters from "@/components/TransactionFilters";
import { getTransactions, deleteTransaction } from "@/api/transactionApi";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {useNavigate, useSearchParams} from "react-router-dom";
import {TransactionSummary, type TransactionSummaryProps} from "@/components/TransactionSummary.tsx";
import {getTransactionSummary} from "@/api/summary.ts";

type TransactionFiltersType = {
    type?: string;
    category?: string;
    paymentMethod?: string;
    fromDate?: string;
    toDate?: string;
};

function paramsToFilters(sp: URLSearchParams):TransactionFiltersType {
    return {
        type: sp.get("type") ?? "",
        category: sp.get("category") ?? "",
        paymentMethod: sp.get("paymentMethod") ?? "",
        fromDate: sp.get("fromDate") ?? "",
        toDate: sp.get("toDate") ?? ""
    };
}

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    // const [filters, setFilters] = useState<TransactionFiltersType>({});
    const [summary, setSummary] = useState<TransactionSummaryProps | null>(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const filters = paramsToFilters(searchParams);
    const controllerRef = useRef<AbortController | null>(null);


    // const fetchTransactions = async (appliedFilters?: TransactionFiltersType) => {
    //     try {
    //         const [transactionsData, summaryData] = await Promise.all([
    //             getTransactions(appliedFilters || filters),
    //             getTransactionSummary()
    //         ]);
    //
    //         setTransactions(transactionsData);
    //         setSummary(summaryData);
    //     } catch (error) {
    //         toast.error(error instanceof Error ? error.message : "Error fetching transactions");
    //         console.error(error);
    //     }
    // };

    const fetchTransactions = async () => {
        try {
            controllerRef.current?.abort();
            const ac = new AbortController();
            controllerRef.current = ac;

            const [transactionsData, summaryData] = await Promise.all([
                getTransactions(filters, ac.signal),
                getTransactionSummary()
            ]);

            setTransactions(transactionsData);
            setSummary(summaryData);
        } catch (error) {
            if ((error as Error)?.name === "CanceledError") return;
            toast.error(error instanceof Error ? error.message : "Error fetching transactions");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [searchParams.toString()]);

    const handleFilterChange = (newFilters: TransactionFiltersType) => {
        const cleaned = Object.entries(newFilters)
            .filter(([_, value]) => value !== undefined && value !== "")
            .reduce((acc, [k, v]) => ({...acc, [k]: v }), {} as Record<string, string>);

        setSearchParams(cleaned);
        // setFilters(newFilters);
        // fetchTransactions(newFilters);
    };

    const handleDelete = async (id: number) => {
        try {
            const confirmed = window.confirm("Are you sure you want to delete this transaction?");
            if (!confirmed) return;

            await deleteTransaction(id);
            toast.success("Transaction deleted successfully");
            fetchTransactions();
        } catch (error) {
            toast.error("Failed to delete transaction");
            console.error(error);
        }
    };

    const handleEdit = (transaction: TransactionDTO) => {
        navigate(`/transactions/${transaction.id}/edit`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 mt-24">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <Button
                    className="cursor-pointer"
                    onClick={() => navigate("/transactions/new")}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </div>

            <TransactionFilters onFilterChange={handleFilterChange} />

            <TransactionTable
                transactions={transactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {transactions.length > 0 && summary && (
                <TransactionSummary
                    totalIncome={summary.totalIncome}
                    totalExpense={summary.totalExpense}
                    balance={summary.balance}
                    totalTransactions={summary.totalTransactions}
                />
            )}
        </div>
    );
};

export default TransactionsPage;
