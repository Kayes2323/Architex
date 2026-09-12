import { STATUS } from "../data/mockData.js";

export default function StatusBadge({ status, size = "md" }) {
  const s = STATUS[status] || STATUS.pending;
  const pad = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold ${pad} ${s.classes}`}>
      <span>{s.dot}</span>
      <span>{s.label}</span>
    </span>
  );
}
