import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Plus, User, BarChart3, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
    const { currentUser, username } = useAuth();
    const displayName = currentUser?.firstname ?? username ?? "User";

    return (
        <div className="min-h-screen bg-white px-6 py-12 flex flex-col items-center justify-start text-center mt-24">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {displayName}!
            </h1>
            <p className="text-gray-600 mb-8">
                What would you like to do today?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl">
                <Link to="/transactions/new">
                    <Button variant="default" className="w-full h-20 text-lg gap-2 shadow-md hover:scale-105 transition-all">
                        <Plus className="w-5 h-5" />
                        Add Transaction
                    </Button>
                </Link>

                <Link to="/transactions">
                    <Button variant="secondary" className="w-full h-20 text-lg gap-2 shadow-md hover:scale-105 transition-all">
                        <ClipboardList className="w-5 h-5" />
                        My Transactions
                    </Button>
                </Link>

                <Link to="/profile">
                    <Button variant="outline" className="w-full h-20 text-lg gap-2 shadow-md hover:scale-105 transition-all">
                        <User className="w-5 h-5" />
                        My Profile
                    </Button>
                </Link>

                <Link to="/transactions/statistics">
                    <Button variant="ghost" className="w-full h-20 text-lg gap-2 shadow-md hover:scale-105 transition-all">
                        <BarChart3 className="w-5 h-5" />
                        Statistics
                    </Button>
                </Link>
            </div>
        </div>
    );
}
