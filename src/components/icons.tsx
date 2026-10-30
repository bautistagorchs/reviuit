import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function strokeIcon(size: number, strokeWidth: number, props: SVGProps<SVGSVGElement>) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function ShieldCheckIcon({ size = 16, strokeWidth = 2.2, ...props }: IconProps) {
  return (
    <svg {...strokeIcon(size, Number(strokeWidth), props)}>
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function SearchIcon({ size = 18, strokeWidth = 2.2, ...props }: IconProps) {
  return (
    <svg {...strokeIcon(size, Number(strokeWidth), props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function ListIcon({ size = 20, strokeWidth = 2, ...props }: IconProps) {
  return (
    <svg {...strokeIcon(size, Number(strokeWidth), props)}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

export function PlusIcon({ size = 18, strokeWidth = 2.4, ...props }: IconProps) {
  return (
    <svg {...strokeIcon(size, Number(strokeWidth), props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ThumbUpIcon({ size = 16, strokeWidth = 2, ...props }: IconProps) {
  return (
    <svg {...strokeIcon(size, Number(strokeWidth), props)}>
      <path d="M7 10v10H4V10h3z" />
      <path d="M7 10l4-7c1.5 0 2.5 1 2.2 2.6L12.6 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7" />
    </svg>
  );
}

export function InfoIcon({ size = 16, strokeWidth = 2, ...props }: IconProps) {
  return (
    <svg {...strokeIcon(size, Number(strokeWidth), props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.5" />
    </svg>
  );
}

const STAR_PATH = "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z";

export function StarIcon({ size = 16, filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? undefined : "currentColor"}
      strokeWidth={filled ? undefined : 1.8}
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

export function HeroIllustration() {
  return (
    <svg
      width="340"
      height="340"
      viewBox="0 0 340 340"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="max-w-full text-brand"
    >
      <rect x="92" y="24" width="168" height="292" rx="18" />
      <path d="M156 42h40" />
      <circle cx="132" cy="92" r="20" />
      <path d="M124 96c4 5 12 5 16 0" />
      <path d="M162 84h70M162 100h50" />
      <path d="M116 140l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="currentColor" />
      <path d="M150 140l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="currentColor" />
      <path d="M184 140l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="currentColor" />
      <path d="M218 140l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" />
      <rect x="112" y="186" width="128" height="40" rx="6" />
      <path d="M124 200h90M124 212h60" />
      <rect x="112" y="236" width="128" height="40" rx="6" />
      <path d="M124 250h96M124 262h52" />
      <path d="M270 70c0-14 11-24 25-24s25 10 25 24-11 24-25 24c-4 0-8-1-11-3l-12 6 3-11c-3-4-5-10-5-16z" />
      <path d="m284 70 8 8 14-15" />
      <path d="M50 120v16M42 128h16" />
      <path d="M300 240v16M292 248h16" />
    </svg>
  );
}
