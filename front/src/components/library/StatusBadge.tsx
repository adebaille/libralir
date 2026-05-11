import type { BookStatus } from "../../services/libraryApi";
import { STATUS_LABELS, STATUS_COLORS } from "../../constants/bookStatus";

type StatusBadgeProps = {
  status: BookStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}