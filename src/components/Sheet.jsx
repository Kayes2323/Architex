export default function Sheet({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="rise-in relative flex max-h-[92vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-pop sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-2 border-b px-4 py-3.5" style={{ borderColor: "#eeece8" }}>
          <h3 className="flex-1 text-base font-bold" style={{ color: "#28241f" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="flex h-8 w-8 items-center justify-center rounded-full text-base active:scale-95"
            style={{ background: "#f7f7f6", color: "#544c40" }}
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer && (
          <div className="border-t px-4 py-3" style={{ borderColor: "#eeece8" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#3d3830" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 transition-colors";
export const inputStyle = { borderColor: "#dedad2", color: "#28241f" };

export function ChipSelect({ options, value, onChange, getLabel = (o) => o, getKey = (o) => o }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const key = getKey(opt);
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="rounded-full border px-3.5 py-2 text-sm font-medium active:scale-95 transition-transform"
            style={{
              borderColor: active ? "#2f7d35" : "#dedad2",
              background: active ? "#dcf1dc" : "#fff",
              color: active ? "#204f25" : "#544c40",
            }}
          >
            {getLabel(opt)}
          </button>
        );
      })}
    </div>
  );
}

export function PrimaryButton({ children, onClick, type = "button", disabled, tone = "brand" }) {
  const bg = tone === "alert" ? "#bd4038" : "#2f7d35";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-card active:scale-[0.98] transition-transform disabled:opacity-40"
      style={{ background: bg }}
    >
      {children}
    </button>
  );
}
