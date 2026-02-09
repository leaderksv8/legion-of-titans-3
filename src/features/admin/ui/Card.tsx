import { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
  actions?: ReactNode;
}

export function Card({ title, subtitle, children, collapsed, onToggle, actions }: CardProps) {
  return (
    <div className="rounded-2xl border border-hairline bg-panel overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-hairline bg-black/20 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-paper">{title}</h2>
            {subtitle && <p className="text-sm text-ash mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {onToggle && (
              <button
                onClick={onToggle}
                className="px-3 py-1 text-xs uppercase tracking-luxe text-ash hover:text-paper transition-colors"
                type="button"
              >
                {collapsed ? "Розгорнути" : "Згорнути"}
              </button>
            )}
          </div>
        </div>
      )}
      {!collapsed && <div className="p-6">{children}</div>}
    </div>
  );
}
