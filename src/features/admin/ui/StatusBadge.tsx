type Status = "PENDING" | "APPROVED" | "REJECTED" | "DELETED";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    PENDING: {
      label: "На модерації",
      className: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    },
    APPROVED: {
      label: "Опубліковано",
      className: "bg-green-500/15 text-green-300 border-green-500/30",
    },
    REJECTED: {
      label: "Відхилено",
      className: "bg-red-500/15 text-red-300 border-red-500/30",
    },
    DELETED: {
      label: "Видалено",
      className: "bg-gray-500/15 text-gray-300 border-gray-500/30",
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs uppercase tracking-luxe ${className}`}
    >
      {label}
    </span>
  );
}
