"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { isPinSessionValid } from "@/lib/pin-utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginDialog() {
    const { isAuthenticated, isNewUser, checkPin, logout, user, setIsAuthenticated } = useAuth();
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Check if user has valid PIN session to auto-login
    useEffect(() => {
        if (user && !isNewUser && !isAuthenticated) {
            if (isPinSessionValid()) {
                // User has valid session, auto-authenticate
                setIsAuthenticated(true);
            }
        }
    }, [user, isNewUser, isAuthenticated, setIsAuthenticated]);

    // Show if we have a user loaded but not authenticated yet
    const isOpen = !!user && !isNewUser && !isAuthenticated;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const isValid = await checkPin(pin);
            if (!isValid) {
                setError("Incorrect PIN");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-display text-center">Welcome Back</DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        Enter your security PIN to access your dashboard.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="pin" className="text-zinc-300">Security PIN</Label>
                        <Input
                            id="pin"
                            type="password"
                            placeholder="••••••"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) e.preventDefault();
                            }}                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && pin.length >= 4) {
                                    e.preventDefault();
                                    handleLogin(e as any);
                                }
                            }}                            inputMode="numeric"
                            autoFocus
                            className="bg-zinc-800 border-zinc-700 text-white focus:ring-neon-pink focus:border-neon-pink text-center text-2xl tracking-widest"
                            maxLength={6}
                        />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="ghost" onClick={logout} className="flex-1 text-zinc-400 hover:text-white">
                            Disconnect
                        </Button>
                        <Button type="submit" disabled={loading || pin.length < 4} className="flex-1 bg-neon-pink hover:bg-neon-pink/80 text-white">
                            {loading ? "Verifying..." : "Unlock"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
