interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Checkbox({ checked, onChange, disabled, label }: CheckboxProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded border-hairline bg-black/20 text-gold focus:ring-gold/50 focus:ring-2 disabled:opacity-50"
        style={{ accentColor: "var(--gold)" }}
      />
      {label && (
        <span className="text-sm text-paper">
          {label}
        </span>
      )}
    </label>
  );
}
