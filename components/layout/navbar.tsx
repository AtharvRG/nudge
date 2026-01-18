"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 p-6 md:px-12 flex items-center justify-between bg-transparent pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex items-center gap-3 pointer-events-auto"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div
          className="w-10 h-10 md:w-12 md:h-12 relative rounded-lg overflow-hidden"
          style={{
            transformOrigin: "center",
          }}
        >
          <Image
            src="/nudge-symbol.png"
            alt="Nudge Protocol Logo"
            fill
            sizes="(min-width: 768px) 48px, 40px"
            className="object-cover"
          />
        </div>
        <span
          className="text-3xl tracking-[0.1em] text-white/80 sm:block font-display"
        >
          NUDGE
        </span>
      </motion.div>

      <motion.div
        className="flex items-center gap-8 pointer-events-auto"
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
        >
          <Link
            href="https://chameleon-anchor.vercel.app"
            target="_blank"
            className="text-white/80 text-md md:text-2xl font-medium tracking-[0.2em] transition-all hover:text-cyan-400 font-display"
          >
            DOCS
          </Link>
        </motion.div>
        <motion.div
        >
          <Link
            href="/dashboard"
            className="text-white/80 text-md md:text-2xl font-medium tracking-[0.2em] transition-all hover:text-yellow-400 uppercase font-display"
          >
            APP
          </Link>
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}
