import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:px-12 flex items-center justify-between bg-transparent pointer-events-none">
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-lg overflow-hidden border border-white/20">
          <Image 
            src="/nudge-symbol.jpg" 
            alt="Nudge Protocol Logo" 
            fill
            className="object-cover"
          />
        </div>
        <span className="font-bold text-xs tracking-[0.2em] uppercase text-white/80 hidden sm:block">
          NUDGE PRIVACY PROTOCOL
        </span>
      </div>

      <div className="flex items-center gap-8 pointer-events-auto">
        {["FEATURES", "DOCS", "APP"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-white/80 text-md md:text-lg font-medium tracking-[0.2em] hover:text-cyan-400 transition-colors uppercase"
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
}
