"use client";

import { useAuth } from "@/contexts/auth-context";
import { UserCircle, Shield, Key, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(user?.display_name || "");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    if (!user) return null;

    const handleSaveName = async () => {
        if (!editedName.trim()) {
            setError("Display name cannot be empty");
            return;
        }

        if (editedName === user.display_name) {
            setIsEditingName(false);
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            const { error: updateError } = await supabase
                .from("users")
                .update({ display_name: editedName.trim() })
                .eq("id", user.id);

            if (updateError) {
                setError("Failed to update display name");
                return;
            }

            // Update local user object - requires context update
            user.display_name = editedName.trim();
            setIsEditingName(false);
        } catch (err) {
            setError("An error occurred while updating your name");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedName(user?.display_name || "");
        setIsEditingName(false);
        setError("");
    };

    return (
        <div className="space-y-8 max-w-3xl">
            <header>
                <h1 className="text-5xl font-display text-white">Pro<span className="text-[#8c28c8]">file</span></h1>
                <p className="text-zinc-400">Manage your identity and security settings.</p>
            </header>

            {/* Identity Card */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8 flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-neon-pink to-purple-600 rounded-full flex items-center justify-center text-3xl font-display text-white">
                    {editedName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    {isEditingName ? (
                        <div className="space-y-3 mb-6">
                            <Input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                placeholder="Enter display name"
                                className="bg-zinc-800 border-zinc-700 text-white focus:ring-neon-pink focus:border-neon-pink text-lg"
                                autoFocus
                            />
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSaveName}
                                    disabled={isSaving}
                                    className="bg-neon-pink hover:bg-neon-pink/80 text-white"
                                    size="sm"
                                >
                                    <Check className="w-4 h-4 mr-1" />
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    size="sm"
                                    className="text-zinc-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-display text-white">{user.display_name}</h3>
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                    title="Edit display name"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 font-mono text-sm bg-black/20 w-fit px-3 py-1 rounded-full mb-6">
                                <Key className="w-3 h-3" />
                                {user.public_key.slice(0, 4)}...{user.public_key.slice(-4)}
                            </div>
                        </div>
                    )}
                </div>
                <Button variant="outline" onClick={logout} className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    Disconnect
                </Button>
            </div>

            {/* Security Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-green-500" />
                        <h3 className="text-lg font-medium text-white">Security PIN</h3>
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">
                        Your PIN encrypts your local session. Changing it will require re-verification.
                    </p>
                    <Button disabled  className="w-full">
                        Reset PIN (Coming Soon)
                    </Button>
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <UserCircle className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-lg font-medium text-white">Account Tier</h3>
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">
                        You are currently on the <strong className="text-white">Alpha</strong> plan. Enjoy unlimited privacy features for free.
                    </p>
                    <Button disabled className="w-full opacity-50 cursor-not-allowed">
                        Upgrade (Free)
                    </Button>
                </div>
            </div>
        </div>
    );
}
