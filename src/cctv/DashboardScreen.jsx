import { ScreenHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { computeCctvSummary, bnClock, AI_CAPABILITIES } from "../data/cctvData.js";
import { toBnNumerals } from "../data/mockData.js";

export default function DashboardScreen({ onExit, onOpenCamera, onOpenAlerts, onOpenRecording }) {
  const { cameras, cctvAlerts } = useFarm();
  const summary = computeCctvSummary(cameras, cctvAlerts);
  const recentAlerts = [...cctvAlerts].sort((a, b) => (a.time.h * 60 + a.time.m < b.time.h * 60 + b.time.m ? 1 : -1)).slice(0, 2);

  return (
    <div className="pb-24">
      <ScreenHeader title="📹 ফার্ম CCTV" onBack={onExit} />

      <div className="px-4 pt-4 flex flex-col gap-4">
        <Card>
          <div className="grid grid-cols-3 gap-2 text-center">
            <SummaryStat icon="🟢" label="Online" value={toBnNumerals(summary.online)} />
            <SummaryStat icon="🔴" label="Offline" value={toBnNumerals(summary.offline)} tone={summary.offline > 0 ? "alert" : "default"} />
            <SummaryStat icon="🔔" label="সতর্কতা" value={toBnNumerals(summary.newAlerts)} tone={summary.newAlerts > 0 ? "alert" : "default"} />
          </div>
        </Card>

        <section>
          <h2 className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
            ক্যামেরা তালিকা
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {cameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => onOpenCamera(cam.id)}
                className="overflow-hidden rounded-2xl border bg-white text-left shadow-card active:scale-[0.98] transition-transform"
                style={{ borderColor: cam.status === "offline" ? "#f7c1bb" : "#eeece8" }}
              >
                <div
                  className="relative flex h-24 items-center justify-center"
                  style={{
                    background:
                      cam.status === "online"
                        ? "repeating-linear-gradient(135deg,#1b4120,#1b4120 8px,#204f25 8px,#204f25 16px)"
                        : "#3d3830",
                  }}
                >
                  <span className="text-3xl opacity-90">{cam.icon}</span>
                  {cam.status === "online" ? (
                    <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> LIVE
                    </span>
                  ) : (
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      OFFLINE
                    </span>
                  )}
                </div>
                <div className="px-2.5 py-2">
                  <div className="text-xs font-bold" style={{ color: "#28241f" }}>
                    {cam.icon} {cam.name}
                  </div>
                  <div
                    className="mt-0.5 text-[11px] font-semibold"
                    style={{ color: cam.status === "online" ? "#2f7d35" : "#bd4038" }}
                  >
                    {cam.status === "online" ? "🟢 Online" : "🔴 সংযোগ নেই"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold" style={{ color: "#28241f" }}>
              🔔 সাম্প্রতিক সতর্কতা
            </h2>
            <button onClick={onOpenAlerts} className="text-xs font-semibold" style={{ color: "#2f7d35" }}>
              সব দেখুন →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {recentAlerts.length === 0 && (
              <p className="text-center text-xs" style={{ color: "#867a65" }}>
                কোনো নতুন সতর্কতা নেই
              </p>
            )}
            {recentAlerts.map((a) => {
              const cam = cameras.find((c) => c.id === a.cameraId);
              const critical = a.severity === "critical";
              return (
                <Card key={a.id} onClick={onOpenAlerts} tone={critical ? "alert" : "default"}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold" style={{ color: critical ? "#973430" : "#28241f" }}>
                        {critical ? "🔴" : "🟠"} {a.bnTitle}
                      </div>
                      <div className="text-[11px]" style={{ color: "#867a65" }}>
                        {cam ? `${cam.icon} ${cam.name}` : ""} · {bnClock(a.time.h, a.time.m)}
                      </div>
                    </div>
                    {a.status === "new" && (
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#fbdedb", color: "#7c2e2b" }}>
                        নতুন
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <button
          onClick={onOpenRecording}
          className="flex items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-card active:scale-[0.98] transition-transform"
          style={{ borderColor: "#eeece8" }}
        >
          <span className="text-2xl">📅</span>
          <div className="flex-1">
            <div className="text-sm font-bold" style={{ color: "#28241f" }}>
              রেকর্ডিং ইতিহাস
            </div>
            <div className="text-xs" style={{ color: "#867a65" }}>
              তারিখ অনুযায়ী পুরনো রেকর্ডিং দেখুন
            </div>
          </div>
          <span style={{ color: "#c3bcae" }}>›</span>
        </button>

        <Card style={{ background: "#f7f7f6" }}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: "#28241f" }}>
              🤖 AI Farm Monitoring
            </span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#eeece8", color: "#6b6151" }}>
              শীঘ্রই আসছে
            </span>
          </div>
          <p className="mb-2 text-xs" style={{ color: "#867a65" }}>
            ভবিষ্যতে ক্যামেরা থেকে স্বয়ংক্রিয়ভাবে শনাক্ত করা যাবে:
          </p>
          <div className="flex flex-col gap-1">
            {AI_CAPABILITIES.map((cap) => (
              <div key={cap} className="text-xs" style={{ color: "#544c40" }}>
                • {cap}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryStat({ icon, label, value, tone }) {
  const alert = tone === "alert";
  return (
    <div>
      <div className="text-lg font-extrabold" style={{ color: alert ? "#bd4038" : "#28241f" }}>
        {icon} {value}
      </div>
      <div className="text-[11px] font-medium" style={{ color: "#867a65" }}>
        {label}
      </div>
    </div>
  );
}
