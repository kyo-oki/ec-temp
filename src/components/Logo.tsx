export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield background */}
      <path
        d="M50 5L85 20V45C85 65 75 80 50 95C25 80 15 65 15 45V20L50 5Z"
        fill="#1E40AF"
      />
      
      {/* Inner shield detail */}
      <path
        d="M50 15L75 25V45C75 60 68 72 50 85C32 72 25 60 25 45V25L50 15Z"
        fill="#3B82F6"
      />
      
      {/* Sports ball design */}
      <circle cx="50" cy="50" r="15" fill="white" />
      <path
        d="M35 50C35 41.7 41.7 35 50 35M65 50C65 58.3 58.3 65 50 65"
        stroke="#1E40AF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M50 35V65M40 42L60 58M40 58L60 42"
        stroke="#1E40AF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo className="w-10 h-10" />
      <div className="flex flex-col">
        <span className="leading-none">ProGear</span>
        <span className="text-xs text-blue-600 leading-none">Hub</span>
      </div>
    </div>
  );
}
