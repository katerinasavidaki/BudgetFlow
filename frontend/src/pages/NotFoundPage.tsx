import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
            <AlertTriangle className="h-19 w-19 text-yellow-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
            <Button onClick={handleBackHome} className="hover:bg-custom-blue hover:text-white">
                Go to Home
            </Button>
        </div>
    );
};

export default NotFoundPage;
