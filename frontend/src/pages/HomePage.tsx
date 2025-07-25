// src/pages/HomePage.tsx
import { ReceiptEuro } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="text-center space-y-6 mt-35">
            <div className="flex items-center justify-center gap-4">
            <h1 className="text-3xl font-bold text-[#174869]">Welcome to BudgetFlow!</h1>
                <ReceiptEuro className="text-[#255a74] h-8 w-8"/>
            </div>
            <p className="text-lg text-gray-700">Manage your finances quick and easy.</p>
            <div className="space-x-4">
                <Link
                    to="/login"
                    className="bg-[#174869] text-white px-6 py-2 rounded hover:bg-[#10344e]"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="bg-gray-100 border border-[#174869] text-[#174869] px-6 py-2 rounded hover:bg-gray-200"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}
