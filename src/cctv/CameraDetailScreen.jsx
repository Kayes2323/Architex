import { useEffect, useState } from "react";
import { ScreenHeader } from "../components/TopHeader.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { cameraById, bnClock } from "../data/cctvData.js";

export default function CameraDetailScreen({ cameraId, onBack, onSwitchCamera, onOpenSettings }) {
  const { cameras, retryCamera } = useFarm();
  const camera = cameraById(cameras, cameraId);
  const [fullscreen, setFullscreen] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [flash, setFlash] = useState(false);
  const [toast, setToast] = useState("");
  const [reconnecting, setReconnecting] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => setAudioOn(false), [cameraId]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!camera) {
    return (
      <div className="pb-24">
        <ScreenHeader title="ক্যামেরা পাওয়া যায়নি" onBack={onBack} />
      </div>
    );
  }

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1800);
  };

  const takeSnapshot = () => {
    if (camera.status !== "online") return;
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
    flashToast("📸 ছবি তোলা হয়েছে ✓");
  };

  const retry = () => {
    setReconnecting(true);
    setTimeout(() => {
      retryCamera(camera.id);
      setReconnecting(false);
    }, 1300);
  };

  const timeStr = now.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const viewport = (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        background: camera.status === "online" ? "repeating-linear-gradient(135deg,#12200f,#12200f 10px,#1b2e16 10px,#1b2e16 20px)" : "#221f1c",
        height: fullscreen ? "100vh" : "min(58vh, 420px)",
        borderRadius: fullscreen ? 0 : 16,
      }}
    >
      {camera.status === "online" ? (
        <>
          <span className="text-6xl opacity-80">{camera.icon}</span>

          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-black/55 px-2 py-1 text-xs font-bold text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> LIVE
          </div>
          <div className="absolute right-3 top-3 rounded bg-black/55 px-2 py-1 font-mono text-xs text-white">{timeStr}</div>

          <div className="absolute bottom-3 left-3 rounded bg-black/55 px-2 py-1 text-xs text-white">
            {camera.icon} {camera.name}
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded bg-black/55 px-2 py-1 text-xs font-semibold text-brand-100" style={{ color: "#8ccd8f" }}>
            🟢 সংযোগ আছে
          </div>

          {flash && <div className="absolute inset-0 bg-white" style={{ opacity: 0.85 }} />}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 px-6 text-center">
          <span className="text-5xl opacity-60">{camera.icon}</span>
          <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "#7c2e2b", color: "#fff" }}>
            🔴 OFFLINE
          </span>
          <p className="text-sm text-white/80">Camera connection lost</p>
          {camera.lastConnected && (
            <p className="text-xs text-white/60">
              Last connected: {bnClock(camera.lastConnected.h, camera.lastConnected.m)}
            </p>
          )}
          <button
            onClick={retry}
            disabled={reconnecting}
            className="mt-2 rounded-full px-4 py-2 text-sm font-bold text-white active:scale-95 transition-transform disabled:opacity-60"
            style={{ background: "#2f7d35" }}
          >
            {reconnecting ? "সংযোগ করা হচ্ছে..." : "🔁 Retry"}
          </button>
        </div>
      )}

      {fullscreen && (
        <button
          onClick={() => setFullscreen(false)}
          className="absolute right-3 top-14 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white"
        >
          ✕
        </button>
      )}

      {toast && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-4 py-1.5 text-xs font-semibold text-white">
          {toast}
        </div>
      )}
    </div>
  );

  if (fullscreen) {
    return <div className="fixed inset-0 z-50 bg-black">{viewport}</div>;
  }

  return (
    <div className="pb-24">
      <ScreenHeader
        title={`${camera.icon} ${camera.name}`}
        onBack={onBack}
        right={
          <span
            className="rounded-full px-2 py-1 text-[11px] font-bold"
            style={{
              background: camera.status === "online" ? "#f0f9f0" : "#fdf1f0",
              color: camera.status === "online" ? "#204f25" : "#973430",
            }}
          >
            {camera.status === "online" ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
        }
      />

      <div className="px-4 pt-4 flex flex-col gap-4">
        {viewport}

        <div className="grid grid-cols-4 gap-2">
          <ControlButton icon="⛶" label="ফুলস্ক্রিন" onClick={() => setFullscreen(true)} disabled={camera.status !== "online"} />
          <ControlButton
            icon={audioOn ? "🔊" : "🔇"}
            label="অডিও"
            onClick={() => setAudioOn((v) => !v)}
            disabled={!camera.hasAudio || camera.status !== "online"}
            active={audioOn}
          />
          <ControlButton icon="📸" label="ছবি তুলুন" onClick={takeSnapshot} disabled={camera.status !== "online"} />
          <ControlButton icon="⚙️" label="সেটিংস" onClick={() => onOpenSettings(camera.id)} />
        </div>

        <section>
          <h2 className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
            অন্য ক্যামেরা
          </h2>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {cameras.map((c) => {
              const active = c.id === camera.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSwitchCamera(c.id)}
                  className="flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-2 active:scale-95 transition-transform"
                  style={{
                    borderColor: active ? "#2f7d35" : "#eeece8",
                    background: active ? "#dcf1dc" : "#fff",
                  }}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-[11px] font-semibold" style={{ color: active ? "#204f25" : "#544c40" }}>
                    {c.name}
                  </span>
                  <span className="text-[10px]" style={{ color: c.status === "online" ? "#2f7d35" : "#bd4038" }}>
                    {c.status === "online" ? "🟢" : "🔴"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function ControlButton({ icon, label, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 rounded-2xl border bg-white py-3 text-center active:scale-95 transition-transform disabled:opacity-35"
      style={{ borderColor: active ? "#2f7d35" : "#eeece8", background: active ? "#dcf1dc" : "#fff" }}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[10px] font-semibold" style={{ color: "#544c40" }}>
        {label}
      </span>
    </button>
  );
}
