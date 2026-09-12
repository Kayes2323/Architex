import { toBnNumerals } from "../data/mockData.js";

export default function ProgressBar({ percent, tone = "brand", showLabel = true }) {
  const p = Math.max(0, Math.min(100, percent));
  const barColor = tone === "alert" ? "#d9564a" : tone === "warn" ? "#f0900b" : "#3f9944";
  return (
    <div>
      <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ background: "#eeece8" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${p}%`, background: barColor }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-[11px] font-medium" style={{ color: "#6b6151" }}>
          <span>কাজ শেষ: {toBnNumerals(p)}%</span>
          <span>বাকি: {toBnNumerals(100 - p)}%</span>
        </div>
      )}
    </div>
  );
}
