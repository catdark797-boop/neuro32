export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M20 2L36 11v18L20 38 4 29V11z" fill="url(#logoG)" opacity="0.12" />
      <path d="M20 2L36 11v18L20 38 4 29V11z" fill="none" stroke="url(#logoG)" strokeWidth="1.5" />
      <circle cx="20" cy="10" r="2.5" fill="#2563eb" />
      <circle cx="30" cy="16" r="2" fill="#4f46e5" />
      <circle cx="30" cy="26" r="2.5" fill="#7c3aed" />
      <circle cx="20" cy="32" r="2" fill="#4f46e5" />
      <circle cx="10" cy="26" r="2.5" fill="#2563eb" />
      <circle cx="10" cy="16" r="2" fill="#7c3aed" />
      <circle cx="20" cy="20" r="3" fill="url(#logoG)" />
      <line x1="20" y1="10" x2="30" y2="16" stroke="#2563eb" strokeWidth="0.8" opacity="0.5" />
      <line x1="30" y1="16" x2="30" y2="26" stroke="#4f46e5" strokeWidth="0.8" opacity="0.5" />
      <line x1="30" y1="26" x2="20" y2="32" stroke="#7c3aed" strokeWidth="0.8" opacity="0.5" />
      <line x1="20" y1="32" x2="10" y2="26" stroke="#4f46e5" strokeWidth="0.8" opacity="0.5" />
      <line x1="10" y1="26" x2="10" y2="16" stroke="#2563eb" strokeWidth="0.8" opacity="0.5" />
      <line x1="10" y1="16" x2="20" y2="10" stroke="#7c3aed" strokeWidth="0.8" opacity="0.5" />
      <line x1="20" y1="20" x2="20" y2="10" stroke="url(#logoG)" strokeWidth="0.6" opacity="0.4" />
      <line x1="20" y1="20" x2="30" y2="16" stroke="url(#logoG)" strokeWidth="0.6" opacity="0.4" />
      <line x1="20" y1="20" x2="30" y2="26" stroke="url(#logoG)" strokeWidth="0.6" opacity="0.4" />
      <line x1="20" y1="20" x2="20" y2="32" stroke="url(#logoG)" strokeWidth="0.6" opacity="0.4" />
      <line x1="20" y1="20" x2="10" y2="26" stroke="url(#logoG)" strokeWidth="0.6" opacity="0.4" />
      <line x1="20" y1="20" x2="10" y2="16" stroke="url(#logoG)" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}
