export default function EmptyState({ icon = "📭", title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-14 text-center">
      <div className="text-4xl">{icon}</div>
      <div className="mt-2 text-sm font-semibold" style={{ color: "#3d3830" }}>
        {title}
      </div>
      {subtitle && (
        <div className="text-xs" style={{ color: "#867a65" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
