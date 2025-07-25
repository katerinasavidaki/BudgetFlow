import {createContext} from 'react';
import type { LoginFields } from '@/api/auth/authApi';

type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
    username: string | null;
    loading: boolean;
    login: (fields: LoginFields) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);