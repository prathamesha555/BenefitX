import Link from "next/link";

interface BenefitXLogoProps {
  showTagline?: boolean;
  className?: string;
}

export default function BenefitXLogo({
  showTagline = false,
  className = "",
}: BenefitXLogoProps) {
  return (
    <Link
      href="/"
      aria-label="BenefitX Home"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      {/* Logo Icon */}

      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#075B46] via-[#123D32] to-[#167A5B] shadow-lg shadow-[#123D32]/20">

        <span className="font-serif text-[30px] font-bold leading-none text-white">
          B
        </span>

        <span className="absolute bottom-[5px] right-[5px] text-[13px] font-black text-[#D6B779]">
          X
        </span>

        <div className="absolute right-0 top-0 h-5 w-5 rounded-bl-full bg-white/10" />

        <div className="absolute bottom-0 left-0 h-1 w-full bg-[#D6B779]/70" />

      </div>

      {/* Brand Name */}

      <div className="flex flex-col">

        <span className="text-[26px] font-extrabold tracking-[-1.4px] leading-none text-[#123D32]">
          Benefit<span className="text-[#B8954B]">X</span>
        </span>

        {showTagline && (
          <span className="mt-1.5 text-[9px] font-semibold tracking-[1.5px] text-[#78857C]">
            DISCOVER. BENEFIT. GROW.
          </span>
        )}

      </div>
    </Link>
  );
}