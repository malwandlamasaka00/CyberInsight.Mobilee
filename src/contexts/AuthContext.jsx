import { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("access_token")
    );

    const login = async (email, password) => {
        const response = await authService.login(email, password);

        setIsAuthenticated(true);

        return response;
    };

    const register = async (
        first_name,
        last_name,
        email,
        password
    ) => {
        return await authService.register(
            first_name,
            last_name,
            email,
            password
        );
    };

    const logout = async () => {
        await authService.logout();
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                register,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}