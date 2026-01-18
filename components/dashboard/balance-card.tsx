"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cardHoverVariants } from "@/lib/animations";

interface BalanceCardProps {
    balance: number;
    onRefresh: () => void;
    onWithdraw: () => void;
    isLoading: boolean;
    className?: string;
}

export function BalanceCard({ balance, onRefresh, onWithdraw, isLoading, className }: BalanceCardProps) {
    return (
        <motion.div
            className={cn("p-8 rounded-xl bg-zinc-900/50 border border-white/10 relative overflow-hidden group", className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover="hover"
            whileInView="hover"
        >
            <motion.div
                className="absolute -top-20 -right-20 w-64 h-64 bg-neon-pink/10 rounded-full blur-[80px] group-hover:bg-neon-pink/20 transition-all duration-500"
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                }}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <motion.span
                        className="font-mono text-zinc-500 text-xs uppercase tracking-[0.2em] flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        Shielded Balance
                    </motion.span>
                    <motion.button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RefreshCw
                            size={14}
                            className={isLoading ? "animate-spin text-neon-pink" : ""}
                        />
                    </motion.button>
                </div>

                <motion.div
                    className="py-6"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <motion.div
                        className="text-5xl md:text-6xl font-display text-white tracking-tight"
                        whileInView={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 100 }}
                    >
                        {balance.toFixed(4)} <span className="text-2xl text-zinc-600 font-light">SOL</span>
                    </motion.div>
                    <motion.div
                        className="text-sm text-zinc-500 mt-2 font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        ≈ ${(balance * 145).toFixed(2)} USD
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Button
                        variant="neon"
                        className="w-full justify-center"
                        onClick={onWithdraw}
                        disabled={balance <= 0 || isLoading}
                    >
                        {isLoading ? "Processing..." : "Unshield & Withdraw"}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}
