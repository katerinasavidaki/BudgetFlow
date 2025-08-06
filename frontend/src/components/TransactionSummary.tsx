import { Card, CardContent } from "@/components/ui/card";

export type TransactionSummaryProps = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    totalTransactions: number;
};

export const TransactionSummary = ({
                                       totalIncome,
                                       totalExpense,
                                       balance,
                                       totalTransactions,
                                   }: TransactionSummaryProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card>
                <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">Total Income</p>
                    <p className="text-xl font-bold text-green-600">€{totalIncome.toFixed(2)}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-xl font-bold text-red-600">€{totalExpense.toFixed(2)}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-xl font-bold">
                        €{balance.toFixed(2)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-xl font-bold">{totalTransactions}</p>
                </CardContent>
            </Card>
        </div>
    );
};
