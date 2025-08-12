import {
    ShoppingCart,
    type LucideIcon,
    PiggyBank,
    Utensils,
    Car,
    Heart,
    School,
    Lamp,
    Circle,
    Wallet, CreditCard, Plane, Landmark, Popcorn,
    Home, BadgeEuro
} from "lucide-react";


type OptionType = {
    value: string;
    label: string;
    icon: LucideIcon;
}

export const transactionTypeOptions: OptionType[] = [
    { value: "INCOME", label: "Income", icon: PiggyBank },
    { value: "EXPENSE", label: "Expense", icon: ShoppingCart },
] as const;

export type TransactionType = typeof transactionTypeOptions[number]["value"];

export const transactionCategoryOptions: OptionType[] = [
    { value: "FOOD", label: "Food", icon: Utensils },
    { value: "TRANSPORT", label: "Transport", icon: Car },
    { value: "RENT", label: "Rent", icon: Home },
    { value: "SALARY", label: "Salary", icon: BadgeEuro},
    { value: "SHOPPING", label: "Shopping", icon: ShoppingCart },
    { value: "HEALTH", label: "Health", icon: Heart },
    { value: "EDUCATION", label: "Education", icon: School },
    { value: "TRAVEL", label: "Travel", icon: Plane },
    { value: "UTILITIES", label: "Utilities", icon: Lamp},
    { value: "ENTERTAINMENT", label: "Entertainment", icon: Popcorn },
    { value: "OTHER", label: "Other", icon: Circle}
] as const;

export type TransactionCategory = typeof transactionCategoryOptions[number]["value"];

export const transactionMethodOptions: OptionType[] = [
    { value: "CASH", label: "Cash", icon: Wallet },
    { value: "CARD", label: "Card", icon: CreditCard },
    { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Landmark },
    { value: "OTHER", label: "Other", icon: Circle}

] as const;

export type TransactionMethod = typeof transactionMethodOptions[number]["value"];