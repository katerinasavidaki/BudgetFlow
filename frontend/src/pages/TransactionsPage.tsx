import { useEffect, useState } from "react";
import type { TransactionDTO } from "@/api/transactionApi.ts";
import TransactionTable from "@/components/TransactionTable";
import TransactionFilters from "@/components/TransactionFilters";
import { getTransactions, deleteTransaction } from "@/api/transactionApi";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type TransactionFiltersType = {
    type?: string;
    category?: string;
    paymentMethod?: string;
    dateFrom?: string;
    dateTo?: string;
};

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [filters, setFilters] = useState<TransactionFiltersType>({});
    const navigate = useNavigate();

    // Fetch with filters
    const fetchTransactions = async (appliedFilters?: TransactionFiltersType) => {
        try {
            const data = await getTransactions(appliedFilters || filters);
            setTransactions(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error fetching transactions");
            console.error(error);
        }
    };

    // on mount
    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleFilterChange = (newFilters: TransactionFiltersType) => {
        setFilters(newFilters);
        fetchTransactions(newFilters);
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
                <Button onClick={() => navigate("/transactions/new")}>
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
        </div>
    );
};

export default TransactionsPage;
