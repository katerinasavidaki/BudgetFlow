import type {TransactionDTO} from "@/api/transactionApi";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    transactions: TransactionDTO[];
    onEdit: (transaction: TransactionDTO) => void;
    onDelete: (id: number) => void;
};

const TransactionTable = ({ transactions, onEdit, onDelete }: Props) => {
    if (transactions.length === 0) {
        return <p className="text-center text-muted-foreground">No transactions found.</p>;
    }

    return (
        <div className="overflow-x-auto border rounded-md">
            <table className="w-full text-sm text-left table-auto">
                <thead className="bg-muted">
                <tr>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Method</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((t) => (
                    <tr key={t.id} className="border-t hover:bg-muted/30">
                        <td className="px-4 py-2 font-medium">{t.amount.toFixed(2)} €</td>
                        <td className="px-4 py-2">{t.description}</td>
                        <td className="px-4 py-2">{t.category}</td>
                        <td className="px-4 py-2">{t.type}</td>
                        <td className="px-4 py-2">{t.paymentMethod}</td>
                        <td className="px-4 py-2">{t.date}</td>
                        <td className="px-4 py-2 flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(t)}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onDelete(t.id)}
                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
