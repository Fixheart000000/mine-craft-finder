const ShaderIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3v18M5.5 8.5l13 7M5.5 15.5l13-7" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default ShaderIcon;
