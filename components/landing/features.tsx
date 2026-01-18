"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Link2, Lock, Eye, CheckCircle2 } from "lucide-react";
import { containerVariants, fadeInUpVariants } from "@/lib/animations";

export function Features() {
    const features = [
        {
            icon: Shield,
            title: "Shielded Transactions",
            description: "Hide transaction amounts and destinations with zero-knowledge proofs.",
        },
        {
            icon: Zap,
            title: "Instant Privacy",
            description: "Get instant privacy with our optimized compression algorithms.",
        },
        {
            icon: Lock,
            title: "Military-Grade Encryption",
            description: "Protected by cutting-edge cryptographic standards.",
        },
        {
            icon: Eye,
            title: "On-Chain Privacy",
            description: "Complete privacy while staying fully transparent to the network.",
        },
        {
            icon: Link2,
            title: "Seamless Integration",
            description: "Works with existing Solana wallets and applications.",
        },
        {
            icon: CheckCircle2,
            title: "Trusted Security",
            description: "Trusted protocols ensuring your data stays safe.",
        },
    ];

    return (
        <section className="relative py-32 px-6 md:px-12 bg-background overflow-hidden" id="features">
            {/* Header */}
            <motion.div
                className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row items-end justify-between gap-8 border-b border-white/10 pb-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div variants={fadeInUpVariants} transition={{ duration: 0.6 }}>
                    <h2 className="text-5xl md:text-7xl font-display text-white mb-4 leading-[0.9]">
                        PRIVACY<br />
                        <span className="text-zinc-500">REDEFINED</span>
                    </h2>
                </motion.div>
                <motion.div className="max-w-md" variants={fadeInUpVariants} transition={{ duration: 0.6, delay: 0.1 }}>
                    <p className="text-xl text-zinc-400 font-body leading-relaxed">
                        Nudge isn't just a privacy tool; it's a lifestyle.
                        Experience the first high-fidelity privacy protocol on Solana.
                    </p>
                </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div
                            key={feature.title}
                            className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-neon-pink/50 transition-all duration-300 overflow-hidden relative"
                            variants={fadeInUpVariants}
                            transition={{ duration: 0.5 }}
                            whileHover={{
                                y: -8,
                                boxShadow: "0 20px 40px rgba(247, 39, 152, 0.15)",
                                borderColor: "rgba(247, 39, 152, 0.5)",
                            }}
                        >
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/0 via-transparent to-neon-pink/0 group-hover:from-neon-pink/10 group-hover:to-neon-pink/5 transition-all duration-300" />

                            {/* Content */}
                            <div className="relative z-10">
                                <motion.div
                                    className="inline-block p-4 bg-neon-pink/10 rounded-xl mb-6 group-hover:bg-neon-pink/20 transition-colors"
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Icon className="w-6 h-6 text-neon-pink group-hover:text-neon-yellow transition-colors" />
                                </motion.div>

                                <h3 className="text-2xl font-display text-white mb-3 group-hover:text-neon-pink transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
