import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "Manager" | "Dispatcher" | "Safety Officer" | "Finance";

export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => { success: boolean, error?: string };
    signup: (email: string, password: string, name: string, role: Role) => { success: boolean, error?: string };
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_MOCK: User[] = [];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
        const savedUsers = localStorage.getItem("fleetData_registeredUsers");
        return savedUsers ? JSON.parse(savedUsers) : USERS_MOCK;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("fleetData_user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse saved user", e);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem("fleetData_registeredUsers", JSON.stringify(registeredUsers));
    }, [registeredUsers]);

    const login = (email: string, password?: string) => {
        const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

        if (foundUser) {
            // Remove password from local storage session for basic security
            const { password, ...userSession } = foundUser;
            setUser(userSession as User);
            localStorage.setItem("fleetData_user", JSON.stringify(userSession));
            return { success: true };
        }

        return { success: false, error: "Invalid email or password." };
    };

    const signup = (email: string, password: string, name: string, role: Role) => {
        if (registeredUsers.some(u => u.email === email)) {
            return { success: false, error: "Email is already registered." };
        }

        const newUser: User = {
            id: `u_${Date.now()}`,
            email,
            password,
            name,
            role,
        };

        setRegisteredUsers(prev => [...prev, newUser]);

        // Auto login after signup
        const { password: _, ...userSession } = newUser;
        setUser(userSession as User);
        localStorage.setItem("fleetData_user", JSON.stringify(userSession));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("fleetData_user");
    };

    if (loading) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
