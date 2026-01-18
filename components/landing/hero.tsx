"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeInUpVariants,
  blurInVariants,
  containerVariants,
  slideInLeftVariants,
  slideInRightVariants,
} from "@/lib/animations";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background">
      {/* Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-background to-background pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Main Hero Content */}
      <div className="relative z-10 w-full max-w-[92vw] mx-auto flex justify-center items-center h-[62vh]">
        
        {/* Accent Text: 'private' (Top Left) */}
        <motion.span
          className="absolute top-[6%] left-[4%] font-despina text-[clamp(2.5rem,6vw,6.5rem)] text-white z-30 -rotate-12 pointer-events-none mix-blend-overlay opacity-80 select-none"
          initial={{ opacity: 0, x: -50, rotate: -20 }}
          animate={{ opacity: 0.8, x: 0, rotate: -12 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          private
        </motion.span>

        {/* Accent Text: 'payments' (Bottom Right) */}
        <motion.span
          className="absolute bottom-[8%] right-[4%] font-despina text-[clamp(2.5rem,6vw,6.5rem)] text-white z-30 -rotate-6 pointer-events-none mix-blend-overlay opacity-80 select-none"
          initial={{ opacity: 0, x: 50, rotate: 0 }}
          animate={{ opacity: 0.8, x: 0, rotate: -6 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          payments
        </motion.span>

        {/* 'NUDGE' Logo Typography - POPFINE Font (Fixed) */}
        <motion.div
          className="relative w-full flex justify-center items-center gap-2 md:gap-4 select-none py-28"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {["N", "U", "D", "G", "E"].map((char, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Pink Offset Layer */}
              <span
                className="absolute inset-0 z-20 text-[25vw] md:text-[35vw] leading-[1.1] font-display text-transparent pointer-events-none select-none"
                style={{
                  WebkitTextStroke: "1.5px #F72798",
                  transform: "translate(10px, -10px)",
                  opacity: 0.6,
                }}
              >
                {char}
              </span>

              {/* Cyan Offset Layer */}
              <span
                className="absolute inset-0 z-0 text-[25vw] md:text-[35vw] leading-[1.1] font-display text-transparent pointer-events-none select-none"
                style={{
                  WebkitTextStroke: "1.5px #00FFFF",
                  transform: "translate(-10px, 10px)",
                  opacity: 0.6,
                }}
              >
                {char}
              </span>

              {/* Yellow Offset Layer */}
              <span
                className="absolute inset-0 z-0 text-[25vw] md:text-[35vw] leading-[1.1] font-display text-transparent pointer-events-none select-none"
                style={{
                  WebkitTextStroke: "1.5px #EBF400",
                  transform: "translate(-20px, 20px)",
                  opacity: 0.6,
                }}
              >
                {char}
              </span>

              {/* Main Character with Image Mask */}
                <span
                className="relative z-10 block text-[25vw] md:text-[35vw] leading-[1.1] font-display text-transparent bg-clip-text bg-cover bg-center"
                style={{
                  backgroundImage: "url('/hero-mask1.jpg')",
                  transform: "scale(1)",
                  backgroundPosition: `${index * 20}% 30%`,
                  backgroundSize: "cover",
                  backgroundAttachment: "fixed",
                }}
                >
                {char}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Section - Capabilities & CTA */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col md:flex-row justify-between items-end z-20 gap-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        
        {/* Left: Capabilities Tags */}
        <motion.div
          className="flex flex-col gap-4 w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-neon-yellow  font-display text-3xl uppercase tracking-widest mb-2">
            Capabilities
          </h3>
          <div className="flex flex-wrap gap-3 ">
            {['Stealth Addresses', 'ZK Compression', 'Blinks', 'Zero Knowledge'].map((service, idx) => (
              <motion.span
                key={service}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-2xl text-zinc-300 font-display hover:bg-white/10 transition-colors cursor-default backdrop-blur-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5 + idx * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(247, 39, 152, 0.3)",
                }}
              >
                {service}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Right: CTA Button */}
        <motion.div
          className="w-full max-w-[600px] text-right flex flex-col items-end gap-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <Link 
            href="/dashboard" 
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 text-black hover:bg-black hover:text-yellow-400 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 font-display text-2xl uppercase tracking-wide">
              Launch App
            </span>
            <div className="relative z-10 p-1 bg-black rounded-full group-hover:translate-x-2 hover:bg--yellow-400 transition-transform">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-orange to-neon-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-[2px] bg-white rounded-full opacity-0 group-hover:opacity-100 z-0 transition-opacity duration-300 mix-blend-screen" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
