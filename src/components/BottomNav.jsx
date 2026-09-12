const TABS = [
  { key: "home", icon: "🏠", label: "হোম" },
  { key: "hisab", icon: "💰", label: "হিসাব" },
  { key: "kaj", icon: "🛠️", label: "কাজ" },
  { key: "plan", icon: "📋", label: "পরিকল্পনা" },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur"
      style={{ borderColor: "#dedad2", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 active:scale-95 transition-transform"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
                style={{ background: isActive ? "#dcf1dc" : "transparent" }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[11px] font-semibold"
                style={{ color: isActive ? "#26632b" : "#867a65" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
