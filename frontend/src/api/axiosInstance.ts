import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export const setupAxiosInterceptors = (logout: () => void) => {
    api.interceptors.response.use(
        (res) => res,
        (error) => {
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                logout();
            }
            return Promise.reject(error);
        }
    );
};

export default api;
