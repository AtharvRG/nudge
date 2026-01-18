"use client";

import { motion } from "framer-motion";
import { Copy, MoreHorizontal, ExternalLink, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkCardProps {
    label: string;
    url: string;
    clicks?: number;
    totalReceived?: number;
    isActive?: boolean;
    onCopy: (e: React.MouseEvent) => void;
    onClick: () => void;
}

export function LinkCard({ label, url, clicks = 0, totalReceived = 0, isActive = true, onCopy, onClick }: LinkCardProps) {
    return (
        <motion.div
            onClick={onClick}
            className="group relative p-6 rounded-xl bg-zinc-900/30 border border-white/5 hover:border-neon-pink/50 hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{
                y: -5,
                boxShadow: "0 20px 40px rgba(247, 39, 152, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Animated gradient background on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-neon-pink/0 to-neon-pink/0 rounded-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.05 }}
                transition={{ duration: 0.3 }}
            />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <motion.div
                        className={cn(
                            "w-2 h-2 rounded-full",
                            isActive ? "bg-neon-yellow shadow-[0_0_8px_rgba(235,244,0,0.5)]" : "bg-zinc-700"
                        )}
                        animate={isActive ? { scale: [1, 1.3, 1] } : { opacity: 0.5 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.h3
                        className="font-display text-lg text-white group-hover:text-neon-pink transition-colors"
                        whileHover={{ letterSpacing: "0.05em" }}
                    >
                        {label}
                    </motion.h3>
                </div>
                <motion.button
                    className="text-zinc-600 hover:text-white transition-colors"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <MoreHorizontal size={16} />
                </motion.button>
            </div>

            <motion.div
                className="space-y-4 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <motion.div
                    className="p-3 bg-black/40 rounded-lg border border-white/5 flex items-center justify-between group-hover:border-white/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                >
                    <p className="font-mono text-xs text-zinc-400 truncate max-w-[180px]">{url}</p>
                    <motion.button
                        onClick={onCopy}
                        className="text-zinc-500 hover:text-white transition-colors p-1"
                        title="Copy URL"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Copy size={14} />
                    </motion.button>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 gap-4"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 },
                        }}
                        whileHover={{ x: 5 }}
                    >
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Total Volume</p>
                        <motion.p
                            className="font-display text-xl text-white"
                            whileHover={{ scale: 1.1 }}
                        >
                            {totalReceived} SOL
                        </motion.p>
                    </motion.div>
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: 20 },
                            visible: { opacity: 1, x: 0 },
                        }}
                        whileHover={{ x: -5 }}
                    >
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">Views</p>
                        <motion.p
                            className="font-display text-xl text-white"
                            whileHover={{ scale: 1.1 }}
                        >
                            {clicks}
                        </motion.p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
