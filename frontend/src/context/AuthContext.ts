import {createContext} from 'react';
import type { LoginFields } from '@/api/auth/authApi';

export type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
    username: string | null;
    loading: boolean;
    login: (fields: LoginFields) => Promise<void>;
    logout: () => void;
    currentUser: UserReadDTO | null;
    setCurrentUser: (user: UserReadDTO | null) => void;
};

export type UserReadDTO = {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);