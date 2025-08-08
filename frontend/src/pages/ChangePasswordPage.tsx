import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "@/api/user";
import {Label} from "@/components/ui/label.tsx";
import {Lock, Save, X} from "lucide-react";
import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext.ts";
import type {AxiosError} from "axios";

// ✅ Schema
const passwordSchema = z
    .object({
        oldPassword: z.string().min(5, "Old password must be at least 5 characters"),
        newPassword: z.string().min(5, "New password must be at least 5 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ChangePasswordFormData = z.infer<typeof passwordSchema>;

const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext is undefined");

    const { currentUser } = auth;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setError
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        if (!currentUser) {
            toast.error("User not loaded");
            return;
        }
        try {
            await changePasswordApi({
                userId: currentUser.id,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            });
            toast.success("Password changed successfully");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to change password");
            console.error(error);
            const err = error as AxiosError<{ [key: string]: string }>;
            if (err && err.response && err.response.data) {
                Object.entries(err?.response?.data || {}).forEach(([key, message]) => {
                    setError(key as keyof ChangePasswordFormData, { type: "manual", message: message as string });
                })
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 px-4 py-10 bg-white rounded-md shadow-md mt-24">
            <div className="flex mb-2">
                <Lock className="mr-2" />
                <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="oldPassword" className="mb-1">Old Password</Label>
                    <Input autoFocus id="oldPassword" type="password" {...register("oldPassword")} />
                    {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>}
                </div>

                <div>
                    <Label htmlFor="newPassword" className="mb-1">New Password</Label>
                    <Input id="newPassword" type="password" {...register("newPassword")} />
                    {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                </div>

                <div>
                    <Label htmlFor="confirmPassword" className="mb-1">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <div className="flex justify-between pt-4">
                    <Button type="submit" disabled={isSubmitting}
                            className="cursor-pointer">
                        <Save className="mr-1 h-4 w-4" /> Save
                    </Button>
                    <Button
                        className="hover:bg-gray-300 hover:text-black cursor-pointer"
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            reset();
                            navigate("/dashboard");
                        }}
                    >
                        <X className="mr-1 h-4 w-4" /> Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordPage;
