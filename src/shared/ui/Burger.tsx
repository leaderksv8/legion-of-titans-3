export default function Burger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      aria-label="Menu"
      onClick={onClick}
      className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline hover:bg-paper hover:text-ink transition-colors"
    >
      <span className="sr-only">Menu</span>
      <div className="relative h-4 w-4">
        <span
          className={
            "absolute left-0 top-0 h-[2px] w-4 bg-current transition-transform " +
            (open ? "translate-y-[7px] rotate-45" : "")
          }
        />
        <span
          className={
            "absolute left-0 top-[7px] h-[2px] w-4 bg-current transition-opacity " +
            (open ? "opacity-0" : "opacity-100")
          }
        />
        <span
          className={
            "absolute left-0 top-[14px] h-[2px] w-4 bg-current transition-transform " +
            (open ? "-translate-y-[7px] -rotate-45" : "")
          }
        />
      </div>
    </button>
  );
}

