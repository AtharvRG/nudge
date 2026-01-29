"use client";

import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-background to-background pointer-events-none" />

      {/* Centerpiece Text Group */}
      <div className="relative z-10 w-full max-w-[90vw] mx-auto flex justify-center items-center h-[60vh]">
        
        {/* 'private' Accent (Top Left) */}
        <span className="absolute top-[15%] left-[5%] font-script text-5xl md:text-7xl text-white z-30 -rotate-12 pointer-events-none mix-blend-overlay">
          private
        </span>

        {/* 'payments' Accent (Bottom Right) */}
        <span className="absolute bottom-[15%] right-[5%] font-script text-5xl md:text-7xl text-white z-30 -rotate-6 pointer-events-none mix-blend-overlay">
          payments
        </span>

        {/* The "CREATIVE" (NUDGE) Typography - Double Layer Technique (Per Character) */}
        <div className="relative w-full flex justify-center items-center gap-4 select-none py-32">
          {["N", "U", "D", "G", "E"].map((char, index) => (
            <div key={index} className="relative group">
              {/* Layer A: Cyan Outline (Top Right - FOREGROUND) */}
              <span
                className="absolute inset-0 z-20 text-[40vw] leading-[1.1] font-hero text-transparent pointer-events-none select-none"
                style={{
                  WebkitTextStroke: "0.5px #00FFFF", // Cyan
                  transform: "translate(15px, -15px)",
                  opacity: 0.6,
                }}
              >
                {char}
              </span>

              {/* Layer B: Pink Outline (Bottom Left - Inner) */}
              <span
                className="absolute inset-0 z-0 text-[40vw] leading-[1.1] font-hero text-transparent pointer-events-none select-none"
                style={{
                  WebkitTextStroke: "0.5px #F72798", // Neon Pink
                  transform: "translate(-15px, 15px)",
                  opacity: 0.6,
                }}
              >
                {char}
              </span>

              {/* Layer C: Yellow Outline (Bottom Left - Outer) */}
              <span
                className="absolute inset-0 z-0 text-[40vw] leading-[1.1] font-hero text-transparent pointer-events-none select-none"
                style={{
                  WebkitTextStroke: "0.5px #EBF400", // Neon Yellow
                  transform: "translate(-30px, 30px)",
                  opacity: 0.6,
                }}
              >
                {char}
              </span>

              {/* Layer D: Main Mask (Center) */}
              <span
                className="relative z-10 block text-[40vw] leading-[1.1] font-hero text-transparent bg-clip-text bg-cover bg-center animate-text-reveal"
                style={{
                  backgroundImage: "url('/hero-mask.jpg'), linear-gradient(45deg, #FF00aa, #00FFFF)",
                  transform: "scale(1)",
                  backgroundPosition: `${index * 20}% 50%`,
                  backgroundSize: "cover",
                  backgroundAttachment: "fixed", 
                }}
              >
                {char}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Layout - Footer / Content Grid */}
      <div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col md:flex-row justify-between items-end z-20 gap-8">
        
        {/* Left Column: Services Tags */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {['Stealth Addresses', 'ZK Compression', 'Solana Blinks', 'Zero Knowledge'].map((service) => (
            <div 
              key={service}
              className="group cursor-pointer border border-white/30 rounded-[50px] px-8 py-4 text-center transition-all duration-300 hover:bg-white hover:border-white hover:scale-105"
            >
              <span className="text-base md:text-lg font-body uppercase text-white group-hover:text-black transition-colors block tracking-wider">
                {service}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column: Description */}
        <div className="w-full max-w-[600px] text-right">
          <p className="text-[#cccccc] text-xl md:text-3xl leading-[1.4] font-body">
            With Nudge, your financial privacy is paramount. We leverage ZK compression to ensure every transaction is shielded, secure, and stylish. Used by the top Solana power users.
          </p>
        </div>
      </div>
    </section>
  );
}
