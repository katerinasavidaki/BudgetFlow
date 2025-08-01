import {Controller, useForm} from "react-hook-form";
import { transactionCategoryOptions, transactionMethodOptions, transactionTypeOptions } from "@/api/enumHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

export type TransactionFilterValues = {
    type?: string;
    category?: string;
    paymentMethod?: string;
    dateFrom?: string;
    dateTo?: string;
};

type Props = {
    onFilterChange: (filters: TransactionFilterValues) => void;
};

const TransactionFilters = ({ onFilterChange }: Props) => {
    const { register, handleSubmit, reset, control } = useForm<TransactionFilterValues>({
        defaultValues: {
            type: "",
            category: "",
            paymentMethod: "",
            dateFrom: "",
            dateTo: "",
        },
    });

    const onSubmit = (data: TransactionFilterValues) => {
        const cleanFilters = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "")
        );
        onFilterChange(cleanFilters);
    };

    const handleClear = () => {
        reset();
        onFilterChange({});
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-2 md:space-y-0 md:flex md:items-end md:gap-4">
            {/* Type */}
            <div className="w-full md:w-1/4">
                <label className="text-sm font-medium">Type</label>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent>
                        {transactionTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                <opt.icon className="w-4 h-4 mr-2" />
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                    )}
                />
            </div>

            {/* Category */}
            <div className="w-full md:w-1/4">
                <label className="text-sm font-medium">Category</label>
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                        {transactionCategoryOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                <opt.icon className="w-4 h-4 mr-2" />
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                    )}
                />
            </div>

            {/* Payment Method */}
            <div className="w-full md:w-1/4">
                <label className="text-sm font-medium">Payment Method</label>
                <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        {transactionMethodOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                <opt.icon className="w-4 h-4 mr-2" />
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                )}
                />
            </div>

            {/* Date from */}
            <div className="w-full md:w-1/4">
                <label className="text-sm font-medium">From</label>
                <div className="relative">
                    <Input
                        type="date"
                        {...register("dateFrom")}
                        className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            {/* Date to */}
            <div className="w-full md:w-1/4">
                <label className="text-sm font-medium">To</label>
                <div className="relative">
                    <Input
                        type="date"
                        {...register("dateTo")}
                        className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>

            <div className="flex gap-2 mt-3 md:mt-0">
                <Button type="submit" className="hover:bg-custom-blue hover:text-white cursor-pointer">Search</Button>
                <Button type="button" variant="secondary" onClick={handleClear} className="hover:bg-gray-300 hover:text-black cursor-pointer">
                    Clear
                </Button>
            </div>
        </form>
    );
};

export default TransactionFilters;
