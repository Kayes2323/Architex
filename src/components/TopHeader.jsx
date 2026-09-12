export function AppHeader({ subtitle }) {
  return (
    <header className="px-4 pb-3 pt-5" style={{ background: "linear-gradient(180deg,#26632b 0%,#2f7d35 100%)" }}>
      <h1 className="text-lg font-bold text-white leading-tight">🌱 নাজির আহমদ এগ্রো ফার্ম</h1>
      {subtitle && <p className="mt-0.5 text-xs text-brand-100" style={{ color: "#dcf1dc" }}>{subtitle}</p>}
    </header>
  );
}

export function ScreenHeader({ title, onBack, right }) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-2 border-b bg-white px-3 py-3"
      style={{ borderColor: "#eeece8" }}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="ফিরে যান"
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg active:scale-95"
          style={{ background: "#f0f9f0", color: "#26632b" }}
        >
          ←
        </button>
      )}
      <h2 className="flex-1 truncate text-base font-bold" style={{ color: "#28241f" }}>
        {title}
      </h2>
      {right}
    </header>
  );
}
