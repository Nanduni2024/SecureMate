import { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
    token: string | null;
    isLoading: boolean;
    signIn: (token: string) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    isLoading: true,
    signIn: () => { },
    signOut: () => { },
});

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored token
        SecureStore.getItemAsync('token').then((storedToken) => {
            setToken(storedToken);
            setIsLoading(false);
        });
    }, []);

    const signIn = async (newToken: string) => {
        setToken(newToken);
        await SecureStore.setItemAsync('token', newToken);
    };

    const signOut = async () => {
        setToken(null);
        await SecureStore.deleteItemAsync('token');
    };

    return (
        <AuthContext.Provider value={{ token, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
