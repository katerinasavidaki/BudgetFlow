import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {toast} from "sonner";
import SpinnerCircleDemo from "@/components/spinner-02.tsx";
import {type LoginFields, loginSchema} from "@/api/auth/authApi.ts";



function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFields>({
        resolver: zodResolver(loginSchema),
    });

    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginFields) => {
        setLoading(true);
        try {
            await login(data);
            toast.success("You are logged in!");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong during login.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-24 bg-white p-8 rounded shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="username" className="mb-1">Email</Label>
                    <Input autoFocus id="username" {...register("username")} disabled={isSubmitting} />
                    {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="password" className="mb-1" >Password</Label>
                    <Input id="password" type="password" {...register("password")}
                           disabled={isSubmitting}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                </div>
                <Button type="submit" className="w-full mt-5" disabled={loading}>
                    {loading ? <SpinnerCircleDemo /> : "Login"}
                </Button>
            </form>
        </div>
    );
}

export default LoginPage;
