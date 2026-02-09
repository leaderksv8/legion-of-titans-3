import { ReactNode } from "react";

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}

export function ActionButton({
  children,
  onClick,
  variant = "secondary",
  disabled = false,
  type = "button",
  className = "",
}: ActionButtonProps) {
  const baseClasses =
    "h-10 rounded-xl px-4 text-[12px] uppercase tracking-luxe transition-colors disabled:opacity-50";

  const variantClasses = {
    primary: "bg-gold/15 border border-gold/35 text-paper hover:bg-gold/25",
    secondary:
      "border border-hairline bg-black/20 text-paper hover:bg-white/5",
    danger:
      "border border-red-700/50 bg-red-900/10 text-red-300 hover:bg-red-900/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
