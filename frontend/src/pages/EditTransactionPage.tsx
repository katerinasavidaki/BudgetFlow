// src/pages/transactions/EditTransactionPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    updateTransaction,
    getTransactionById,
    type EditTransactionForm,
    updateTransactionSchema
} from "@/api/transactionApi";
import { transactionCategoryOptions, transactionMethodOptions, transactionTypeOptions } from "@/api/enumHelpers";
import {Loader, Pencil} from "lucide-react";

export default function EditTransactionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<EditTransactionForm>({
        resolver: zodResolver(updateTransactionSchema),
        defaultValues: {
            id: 0,
            description: "",
            amount: 0.1,
            date: "",
            type: "INCOME",
            category: "FOOD",
            paymentMethod: "CASH",
        },
    });

    useEffect(() => {
        if (!id) return;
        const fetchTransaction = async () => {
            try {
                const transaction = await getTransactionById(Number(id));
                setValue("id", transaction.id);
                setValue("amount", transaction.amount);
                setValue("description", transaction.description);
                setValue("category", transaction.category);
                setValue("paymentMethod", transaction.paymentMethod);
                setValue("type", transaction.type);
                setValue("date", transaction.date);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch transaction");
                navigate("/transactions");
            }
        };
        fetchTransaction();
    }, [id, setValue, navigate]);

    const onSubmit = async (data: EditTransactionForm) => {
        try {
            await updateTransaction(data);
            toast.success("Transaction updated!");
            navigate("/transactions");
        } catch (error) {
            toast.error("Failed to update transaction");
        }
    };

    if (loading) return <Loader className="animate-spin mx-auto mt-10" size={32} />;

    return (
        <div className="max-w-2xl mx-auto p-6 mt-22 border rounded-md shadow-md">
            <div className="flex">
                <Pencil size={25}/>
                <h1 className="text-2xl font-bold mb-6 ml-1">Edit Transaction</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input type="hidden" {...register("id")} />
                <div>
                    <Label htmlFor="description" className="mb-1">Description</Label>
                    <Input id="description" autoFocus {...register("description")} />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>
                <div>
                    <Label htmlFor="amount" className="mb-1">Amount</Label>
                    <Input id="amount" type="text" {...register("amount")} />
                    {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                </div>
                <div>
                    <Label>Category</Label>
                    <Select onValueChange={(value) => setValue("category", value as EditTransactionForm["category"])} defaultValue="">
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {transactionCategoryOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>
                <div>
                    <Label>Method</Label>
                    <Select onValueChange={(value) => setValue("paymentMethod", value as EditTransactionForm["paymentMethod"])} defaultValue="">
                        <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                            {transactionMethodOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
                </div>
                <div>
                    <Label>Type</Label>
                    <Select onValueChange={(value) => setValue("type", value as EditTransactionForm["type"])} defaultValue="">
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {transactionTypeOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                </div>
                <div>
                    <Label>Date</Label>
                    <Input type="date" {...register("date")} />
                    {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>Update</Button>
            </form>
        </div>
    );
}
