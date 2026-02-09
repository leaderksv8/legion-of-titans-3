interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchInput({ value, onChange, placeholder = "Пошук...", disabled }: SearchInputProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 rounded-xl border border-hairline bg-black/20 text-paper placeholder:text-ash focus:outline-none focus:border-gold/50 focus:bg-black/40 transition-colors disabled:opacity-50"
      />
      {value && !disabled && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-paper transition-colors"
          type="button"
          aria-label="Очистити"
        >
          ✕
        </button>
      )}
    </div>
  );
}
