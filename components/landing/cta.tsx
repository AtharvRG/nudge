"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUpVariants, containerVariants } from "@/lib/animations";

export function CTA() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="relative py-32 overflow-hidden" ref={ref}>
            {/* Background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-neon-pink/5 via-background to-background"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 1 }}
                />
                <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-neon-pink/10 to-transparent blur-3xl"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-pink/10 border border-neon-pink/20 mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        whileHover={{
                            boxShadow: "0 0 20px rgba(247, 39, 152, 0.5)",
                            scale: 1.05,
                        }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-neon-pink" />
                        </motion.div>
                        <span className="text-sm text-neon-pink font-medium">Ready to go private?</span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.2, duration: 0.7 }}
                    >
                        Your Privacy<br />
                        <motion.span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-orange to-neon-yellow inline-block"
                            animate={{
                                backgroundPosition: ["0%", "100%", "0%"],
                            }}
                            style={{
                                backgroundSize: "200% 200%",
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            Starts Now
                        </motion.span>
                    </motion.h2>

                    {/* Subtext */}
                    <motion.p
                        className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        Join the privacy revolution. Create your first stealth payment link in under 30 seconds. 
                        No sign-up, no KYC, no compromises.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                onClick={() => window.location.href = "/dashboard"}
                                variant="primary"
                                size="lg"
                                className="group min-w-[200px] font-display text-3xl hover:bg-white hover:text-black"
                            >
                                Launch App
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </motion.div>
                            </Button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                onClick={() => window.open("https://chameleon-anchor.vercel.app", "_blank")}
                                variant="outline"
                                size="lg"
                                className="min-w-[200px] font-display text-3xl hover:bg-white hover:text-black"
                            >
                                View Documentation
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-zinc-500"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        {[
                            { label: "Open Source", delay: 0.6 },
                            { label: "ZK Shielded", delay: 0.7 },
                            { label: "Non-Custodial", delay: 0.8 },
                        ].map((item, idx) => (
                            <motion.div
                                key={item.label}
                                className="flex items-center gap-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                transition={{ delay: item.delay }}
                                whileHover={{ x: 5, color: "rgb(247, 39, 152)" }}
                            >
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-emerald-500"
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: idx * 0.2,
                                    }}
                                />
                                <span>{item.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
