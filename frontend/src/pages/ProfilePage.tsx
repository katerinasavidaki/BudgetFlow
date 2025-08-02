import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { updateUserApi } from "@/api/user";
import { toast } from "sonner";
import {Label} from "@/components/ui/label.tsx";
import {Pencil, Save, X} from "lucide-react";
import type {AxiosError} from "axios";

// ✅ Zod schema
const profileSchema = z.object({
    firstname: z.string().min(1, "Firstname is required"),
    lastname: z.string().min(1, "Lastname is required"),
    username: z.email("Please provide a valid email"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext not found");

    const { currentUser,  token, setCurrentUser } = auth;
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setError
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            username: "",
        },
    });

    useEffect(() => {
        if (currentUser) {
            reset({
                firstname: currentUser.firstname,
                lastname: currentUser.lastname,
                username: currentUser.username,
            });
        }
    }, [currentUser, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        if (!token || !currentUser) return;

        try {
            const updated = await updateUserApi({
                ...data,
                id: currentUser?.id || 0,
            });
            setCurrentUser(updated); // update context
            toast.success("Personal information updated");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update personal information");
            console.error(error);
            const err = error as AxiosError<{ [key: string]: string }>;
            if (err && err.response && err.response.data) {
                Object.entries(err?.response?.data || {}).forEach(([key, message]) => {
                    setError(key as keyof ProfileFormData, { type: "manual", message: message as string });
                })
            }
        }
    };

    const handleCancel = () => {
        reset(); // revert form
        navigate("/dashboard");
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-md shadow mt-24 px-4 py-10 border rounded-md shadow-md">
            <div className="flex space-x-3">
            <Pencil /> <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="firstname" className="mb-1">Firstname</Label>
                    <Input id="firstname" autoFocus {...register("firstname")} />
                    {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
                </div>

                <div>
                    <Label htmlFor="lastname" className="mb-1">Lastname</Label>
                    <Input id="lastname" {...register("lastname")} />
                    {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
                </div>

                <div>
                    <Label htmlFor="username" className="mb-1">Email</Label>
                    <Input id="username" {...register("username")} />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>

                <div className="flex justify-between items-center pt-4">
                    <div className="space-x-2">
                        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                            <Save className="mr-1 h-4 w-4" /> Save
                        </Button>
                        <Button
                            className="hover:bg-gray-300 hover:text-black cursor-pointer"
                                type="button" variant="secondary" onClick={handleCancel}>
                            <X className="mr-1 h-4 w-4" /> Cancel
                        </Button>
                    </div>
                    <Button
                        type="button"
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => navigate("/change-password")}
                        disabled={isSubmitting}
                    >
                        Change Password
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;
