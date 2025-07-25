// src/pages/RegisterPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { z } from "zod";

export const registerSchema = z.object({
    firstname: z.string().min(4, "Firstname is required"),
    lastname: z.string().min(4, "Lastname is required"),
    username: z.email("Invalid email"),
    password: z.string().min(5, "Password must be at least 5 characters"),
});

export type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { firstname: "", lastname: "", username: "", password: "" },
    });

    const onSubmit = async (data: RegisterValues) => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            const { token } = await response.json();
            await login(token);
            toast.success("Registration successful!");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Something went wrong during registration.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-24 p-8 border-gray-100 border rounded shadow-xl">
            <h1 className="text-2xl font-semibold mb-6 text-center">Create Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Input placeholder="Firstname" autoFocus {...register("firstname")} />
                    {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
                </div>
                <div>
                    <Input placeholder="Lastname" {...register("lastname")} />
                    {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
                </div>
                <div>
                    <Input placeholder="Email" {...register("username")} />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>
                <div>
                    <Input type="password" placeholder="Password" {...register("password")} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Register"}
                </Button>
            </form>
        </div>
    );
}
