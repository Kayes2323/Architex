import { useMemo, useState } from "react";
import { ScreenHeader } from "../components/TopHeader.jsx";
import Sheet from "../components/Sheet.jsx";
import { RECORDING_DATES, generateTimeline } from "../data/cctvData.js";

export default function RecordingHistoryScreen({ onBack }) {
  const [dateKey, setDateKey] = useState(RECORDING_DATES[0].key);
  const [playback, setPlayback] = useState(null);
  const timeline = useMemo(() => generateTimeline(dateKey), [dateKey]);
  const dateLabel = RECORDING_DATES.find((d) => d.key === dateKey)?.label;

  return (
    <div className="pb-24">
      <ScreenHeader title="📅 রেকর্ডিং ইতিহাস" onBack={onBack} />

      <div className="px-4 pt-4 flex flex-col gap-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {RECORDING_DATES.map((d) => {
            const active = d.key === dateKey;
            return (
              <button
                key={d.key}
                onClick={() => setDateKey(d.key)}
                className="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold active:scale-95 transition-transform"
                style={{
                  borderColor: active ? "#2f7d35" : "#dedad2",
                  background: active ? "#dcf1dc" : "#fff",
                  color: active ? "#204f25" : "#544c40",
                }}
              >
                {d.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border bg-white p-3" style={{ borderColor: "#eeece8" }}>
          <div className="mb-2 text-xs font-semibold" style={{ color: "#867a65" }}>
            {dateLabel} — টাইমলাইন
          </div>
          <div className="flex flex-col">
            {timeline.map((row) => (
              <button
                key={row.hour}
                onClick={() => row.hasActivity && setPlayback(row)}
                disabled={!row.hasActivity}
                className="flex items-center gap-3 py-1.5 text-left disabled:cursor-default"
              >
                <span className="w-20 shrink-0 text-[11px]" style={{ color: "#867a65" }}>
                  {row.label}
                </span>
                <span
                  className="h-px flex-1"
                  style={{ background: row.hasActivity ? "transparent" : "#eeece8" }}
                />
                {row.hasActivity ? (
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold active:scale-95 transition-transform"
                    style={{ background: "#dcf1dc", color: "#204f25" }}
                  >
                    ● কার্যকলাপ
                  </span>
                ) : (
                  <span className="text-[11px]" style={{ color: "#c3bcae" }}>
                    —
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs" style={{ color: "#867a65" }}>
          "কার্যকলাপ" চিহ্নিত সময়ে ট্যাপ করলে রেকর্ডিং প্লেব্যাক খুলবে
        </p>
      </div>

      {playback && (
        <Sheet title="🎬 রেকর্ডিং প্লেব্যাক" onClose={() => setPlayback(null)}>
          <div
            className="mb-3 flex h-40 items-center justify-center rounded-xl text-white"
            style={{ background: "#221f1c" }}
          >
            <div className="text-center">
              <div className="text-3xl">▶️</div>
              <div className="mt-1 text-xs text-white/70">এই ফিচারটি ভবিষ্যতে যুক্ত হবে</div>
            </div>
          </div>
          <div className="text-sm" style={{ color: "#3d3830" }}>
            <div className="mb-1 flex justify-between">
              <span style={{ color: "#867a65" }}>তারিখ</span>
              <span className="font-semibold">{dateLabel}</span>
            </div>
            <div className="mb-1 flex justify-between">
              <span style={{ color: "#867a65" }}>সময়</span>
              <span className="font-semibold">{playback.label}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#867a65" }}>ক্যামেরা</span>
              <span className="font-semibold">{playback.cameraName}</span>
            </div>
          </div>
        </Sheet>
      )}
    </div>
  );
}
