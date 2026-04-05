const SkinIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2a3 3 0 0 0-3 3v2h6V5a3 3 0 0 0-3-3z" />
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M7 17v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3" />
    <path d="M5 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1" />
    <path d="M19 9h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1" />
  </svg>
);

export default SkinIcon;
