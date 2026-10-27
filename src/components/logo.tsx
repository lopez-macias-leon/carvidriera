import { portal } from "@/config/portal";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`}>
      <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-brand text-white">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 15v-3l2.2-4.6A2 2 0 017 6.3h10a2 2 0 011.8 1.1L21 12v3" />
          <path d="M3 12h18" />
          <circle cx="7.5" cy="16" r="1.8" />
          <circle cx="16.5" cy="16" r="1.8" />
        </svg>
      </span>
      <span className="text-lg">
        Car<span className="text-brand">Vidriera</span>
      </span>
      <span className="sr-only">{portal.name}</span>
    </span>
  );
}
