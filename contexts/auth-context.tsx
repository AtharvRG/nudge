
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import {
    isWeakPin,
    isValidPinFormat,
    isPinSessionValid,
    setPinSession,
    clearPinSession
} from "@/lib/pin-utils";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isNewUser: boolean; // True if wallet connected but no user found in DB
    checkPin: (pin: string) => Promise<boolean>;
    register: (displayName: string, pin: string) => Promise<boolean>;
    logout: () => void;
    setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isNewUser: false,
    checkPin: async () => false,
    register: async () => false,
    logout: () => { },
    setIsAuthenticated: () => { },
});

async function legacyHashPin(pin: string, salt: string): Promise<string> {
    try {
        if (!globalThis.crypto?.subtle) return pin;
        const encoder = new TextEncoder();
        const data = encoder.encode(`${pin}:${salt}`);
        const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
        return pin;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { publicKey, disconnect } = useWallet();
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewUser, setIsNewUser] = useState(false);

    // We use this to prevent redirect loops or strict checks before pin entry
    const router = useRouter();

    useEffect(() => {
        async function checkUser() {
            if (!publicKey) {
                setUser(null);
                setIsAuthenticated(false);
                setIsNewUser(false);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const address = publicKey.toBase58();

            try {
                const { data, error } = await supabase
                    .from("users")
                    .select("*")
                    .eq("public_key", address)
                    .single();

                if (error || !data) {
                    // User not found -> New User Flow
                    setUser(null);
                    setIsNewUser(true);
                    setIsAuthenticated(false);
                } else {
                    // User found -> Require Pin Flow
                    setUser(data);
                    setIsNewUser(false);
                    // We do NOT set isAuthenticated to true here. 
                    // The user must enter their pin first.
                    setIsAuthenticated(false);
                }
            } catch (err) {
            } finally {
                setIsLoading(false);
            }
        }

        checkUser();
    }, [publicKey]);

    const checkPin = async (pin: string): Promise<boolean> => {
        if (!user || !user.pin_hash || !publicKey) return false;

        const hashed = await legacyHashPin(pin, publicKey.toBase58());
        const isMatch = user.pin_hash === hashed || user.pin_hash === pin;

        if (isMatch) {
            setIsAuthenticated(true);
            setPinSession();

            // Upgrade legacy plaintext PINs to hashed format
            if (user.pin_hash === pin && user.pin_hash !== hashed) {
                await supabase
                    .from("users")
                    .update({ pin_hash: hashed })
                    .eq("id", user.id);
            }

            return true;
        }

        return false;
    };

    const register = async (displayName: string, pin: string): Promise<boolean> => {
        if (!publicKey) return false;

        // Check for weak PIN patterns
        const { isWeak, reason } = isWeakPin(pin);
        if (isWeak) {
            alert(reason || "PIN is too weak.");
            return false;
        }

        const hashed = await legacyHashPin(pin, publicKey.toBase58());

        const newUser = {
            public_key: publicKey.toBase58(),
            display_name: displayName,
            pin_hash: hashed,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("users")
            .insert([newUser])
            .select()
            .single();

        if (error) {
            return false;
        }

        setUser(data);
        setIsNewUser(false);
        setIsAuthenticated(true); // Auto-login on register
        return true;
    };

    const logout = () => {
        clearPinSession();
        disconnect();
        setUser(null);
        setIsAuthenticated(false);
        setIsNewUser(false);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            isNewUser,
            checkPin,
            register,
            logout,
            setIsAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
