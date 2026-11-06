import type { ReactNode } from "react";
import { ShieldCheckIcon, StarIcon } from "@/components/icons";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`m-0 text-[13px] font-bold tracking-[0.18em] text-brand ${className}`}>{children}</p>;
}

export function Chip({ children, tone = "tint" }: { children: ReactNode; tone?: "tint" | "neutral" }) {
  return (
    <span
      className={
        tone === "tint"
          ? "rounded-full bg-brand-tint px-3 py-2 text-sm font-semibold text-brand"
          : "rounded-full bg-cream px-2.5 py-[5px] text-[13px] font-semibold text-body"
      }
    >
      {children}
    </span>
  );
}

export function RatingPill({ value }: { value: string }) {
  return (
    <span className="inline-flex flex-none items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-[15px] font-bold text-brand">
      <StarIcon size={15} />
      {value}
      <span className="font-semibold opacity-70">/5</span>
    </span>
  );
}

export function VerifiedAvatar({ size = 32 }: { size?: number }) {
  return (
    <span
      className="inline-flex flex-none items-center justify-center rounded-full bg-brand-tint text-brand"
      style={{ width: size, height: size }}
    >
      <ShieldCheckIcon size={size / 2} />
    </span>
  );
}

export function PageMain({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <main className={`mx-auto max-w-[1200px] px-6 pb-20 ${className}`}>{children}</main>;
}
