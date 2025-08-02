import {useForm} from "react-hook-form";
import type { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { addTransactionSchema } from "@/api/transactionApi.ts"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createTransactionApi, type TransactionFormValues } from "@/api/transactionApi";
import {Link, useNavigate} from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {useState} from "react";
import {transactionCategoryOptions, transactionMethodOptions, transactionTypeOptions} from "@/api/enumHelpers.ts";

export function NewTransactionPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, setValue, setError } = useForm<TransactionFormValues>({
        resolver: zodResolver(addTransactionSchema),
        defaultValues: {
            amount: "0.1",
            description: "",
            date: "",
            type: "EXPENSE",
            category: "FOOD",
            paymentMethod: "CASH",
        },
    });

    const onSubmit = async (values: TransactionFormValues) => {
        setLoading(true);

        try {
            await createTransactionApi(values);
            toast.success("Transaction added successfully");
            reset();
            navigate("/transactions", { replace: true });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add transaction");
            const err = error as AxiosError<{ [key: string]: string }>;
            if (err && err.response && err.response.data) {
                Object.entries(err?.response?.data || {}).forEach(([key, message]) => {
                    setError(key as keyof TransactionFormValues, { type: "manual", message: message as string });
                })
            }
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-20 p-6 border rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div>
                    <Label htmlFor="amount" className="mb-1">Amount</Label>
                    <Input autoFocus type="text" {...register("amount")} />
                    {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                </div>

                <div>
                    <Label htmlFor="description" className="mb-1">Description</Label>
                    <Input type="text" {...register("description")} />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div>
                    <Label htmlFor="date" className="mb-1">Date</Label>
                    <Input type="date" {...register("date")} />
                    {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                </div>

                {/* Type */}
                <div>
                    <Label className="mb-1">Type</Label>
                    <Select onValueChange={(val:string) => setValue("type", val as TransactionFormValues["type"])}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {transactionTypeOptions.map(({ value, label, icon: Icon }) => (
                                <SelectItem key={value} value={value}>
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" /> {label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <Label className="mb-1">Category</Label>
                    <Select onValueChange={(val:string) => setValue("category", val as TransactionFormValues["category"])}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {transactionCategoryOptions.map(({ value, label, icon: Icon }) => (
                                <SelectItem key={value} value={value}>
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" /> {label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>

                {/* Method */}
                <div>
                    <Label className="mb-1">Method</Label>
                    <Select onValueChange={(val: string) => setValue("paymentMethod", val as TransactionFormValues["paymentMethod"])}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                            {transactionMethodOptions.map(({ value, label, icon: Icon }) => (
                                <SelectItem key={value} value={value}>
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" /> {label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Submitting..." : "Add Transaction"}
                </Button>
                <Link to="/" className="bg-custom-blue text-white px-4 py-2 rounded mt-4 hover:bg-custom-light-blue">
                    Go back to Home
                </Link>
            </form>
        </div>
    );
}