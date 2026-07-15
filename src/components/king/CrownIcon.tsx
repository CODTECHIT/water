interface CrownIconProps {
  className?: string;
  size?: number;
}

/** Minimal gold crown motif echoing the King logo. */
export function CrownIcon({ className, size = 16 }: CrownIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 8l3.5 8h11L21 8l-4.5 3L12 4 7.5 11 3 8z" />
      <path d="M12 16.5v2.5" />
    </svg>
  );
}
