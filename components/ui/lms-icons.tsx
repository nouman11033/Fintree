import * as React from 'react';

export function BookOpenIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <path d="M2 19V6a2 2 0 0 1 2-2h7v17H4a2 2 0 0 1-2-2zm20 0V6a2 2 0 0 0-2-2h-7v17h7a2 2 0 0 0 2-2z" strokeWidth="1.5" />
    </svg>
  );
}

export function VideoIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <rect x="3" y="5" width="15" height="14" rx="2" strokeWidth="1.5" />
      <path d="M21 7l-5 4v2l5 4V7z" strokeWidth="1.5" />
    </svg>
  );
}

export function FileTextIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5" />
      <path d="M8 8h8M8 12h8M8 16h4" strokeWidth="1.5" />
    </svg>
  );
}

export function RepeatIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <path d="M17 1l4 4-4 4" strokeWidth="1.5" />
      <path d="M21 5H7a4 4 0 0 0 0 8h1" strokeWidth="1.5" />
      <path d="M7 23l-4-4 4-4" strokeWidth="1.5" />
      <path d="M3 19h14a4 4 0 0 0 0-8h-1" strokeWidth="1.5" />
    </svg>
  );
}

export function BarChartIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <rect x="3" y="12" width="4" height="8" rx="1" strokeWidth="1.5" />
      <rect x="9" y="8" width="4" height="12" rx="1" strokeWidth="1.5" />
      <rect x="15" y="4" width="4" height="16" rx="1" strokeWidth="1.5" />
    </svg>
  );
}

export function CalendarIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="1.5" />
      <path d="M16 3v4M8 3v4M3 9h18" strokeWidth="1.5" />
    </svg>
  );
}

export function ClipboardListIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" strokeWidth="1.5" />
      <path d="M9 7h6M9 11h6M9 15h2" strokeWidth="1.5" />
    </svg>
  );
}

export function LinkIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <path d="M10 14a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" strokeWidth="1.5" />
      <path d="M14 10a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" strokeWidth="1.5" />
    </svg>
  );
}

export function UserCheckIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <circle cx="9" cy="7" r="4" strokeWidth="1.5" />
      <path d="M17 11l2 2 4-4" strokeWidth="1.5" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h2" strokeWidth="1.5" />
    </svg>
  );
}

export function AlertTriangleIcon({ className = '', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="1.5" />
      <line x1="12" y1="9" x2="12" y2="13" strokeWidth="1.5" />
      <circle cx="12" cy="17" r="1" strokeWidth="1.5" />
    </svg>
  );
} 