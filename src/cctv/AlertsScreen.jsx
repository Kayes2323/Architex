import { useState } from "react";
import { ScreenHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Sheet, { PrimaryButton } from "../components/Sheet.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { cameraById, bnClock } from "../data/cctvData.js";
import { bnDate, TODAY_ISO } from "../data/mockData.js";

export default function AlertsScreen({ onBack, onOpenCamera, onOpenRecording }) {
  const { cameras, cctvAlerts, markAlertViewed } = useFarm();
  const [selectedId, setSelectedId] = useState(null);
  const sorted = [...cctvAlerts].sort((a, b) => (a.time.h * 60 + a.time.m < b.time.h * 60 + b.time.m ? 1 : -1));
  const selected = sorted.find((a) => a.id === selectedId) || null;
  const selectedCam = selected ? cameraById(cameras, selected.cameraId) : null;

  const open = (alert) => {
    setSelectedId(alert.id);
    if (alert.status === "new") markAlertViewed(alert.id);
  };

  return (
    <div className="pb-24">
      <ScreenHeader title="🔔 সতর্কতা" onBack={onBack} />

      <div className="px-4 pt-4 flex flex-col gap-4">
        <h2 className="text-sm font-bold" style={{ color: "#28241f" }}>
          আজকের ঘটনা
        </h2>
        {sorted.length === 0 && (
          <EmptyState icon="🔔" title="কোনো সতর্কতা নেই" subtitle="ক্যামেরায় কিছু শনাক্ত হলে এখানে দেখাবে" />
        )}
        <div className="flex flex-col gap-2">
          {sorted.map((a) => {
            const cam = cameraById(cameras, a.cameraId);
            const critical = a.severity === "critical";
            return (
              <Card key={a.id} onClick={() => open(a)} tone={critical ? "alert" : "default"}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold" style={{ color: critical ? "#973430" : "#28241f" }}>
                      {critical ? "🔴" : "🟠"} {a.bnTitle}
                    </div>
                    <div className="text-[11px]" style={{ color: "#867a65" }}>
                      {cam ? `${cam.icon} ${cam.name}` : ""} · {bnClock(a.time.h, a.time.m)}
                    </div>
                  </div>
                  {a.status === "new" ? (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#fbdedb", color: "#7c2e2b" }}>
                      নতুন
                    </span>
                  ) : (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#eeece8", color: "#6b6151" }}>
                      দেখা হয়েছে
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {selected && (
        <Sheet title={`${selected.severity === "critical" ? "🔴" : "🟠"} ${selected.bnTitle}`} onClose={() => setSelectedId(null)}>
          <div className="mb-4 flex flex-col gap-2 text-sm" style={{ color: "#3d3830" }}>
            <Row label="ক্যামেরা" value={selectedCam ? `${selectedCam.icon} ${selectedCam.name}` : "—"} />
            <Row label="সময়" value={bnClock(selected.time.h, selected.time.m)} />
            <Row label="তারিখ" value={bnDate(TODAY_ISO)} />
            <Row label="Status" value={selected.status === "new" ? "নতুন" : "দেখা হয়েছে"} />
          </div>
          <div className="flex flex-col gap-2">
            <PrimaryButton
              onClick={() => {
                const cameraId = selected.cameraId;
                setSelectedId(null);
                onOpenCamera(cameraId);
              }}
            >
              🔴 লাইভ ক্যামেরা দেখুন
            </PrimaryButton>
            <button
              onClick={() => {
                setSelectedId(null);
                onOpenRecording();
              }}
              className="w-full rounded-xl border py-3 text-sm font-bold active:scale-[0.98] transition-transform"
              style={{ borderColor: "#dedad2", color: "#544c40" }}
            >
              📅 রেকর্ডিং দেখুন
            </button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: "#867a65" }}>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
