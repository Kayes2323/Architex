import { ScreenHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { cameraById, bnClock } from "../data/cctvData.js";

export default function CameraSettingsScreen({ cameraId, onBack }) {
  const { cameras, setCameraRecording } = useFarm();
  const camera = cameraById(cameras, cameraId);

  if (!camera) {
    return (
      <div className="pb-24">
        <ScreenHeader title="সেটিংস পাওয়া যায়নি" onBack={onBack} />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <ScreenHeader title={`⚙️ ${camera.name} — সেটিংস`} onBack={onBack} />

      <div className="px-4 pt-4 flex flex-col gap-4">
        <Card>
          <Row label="Camera Name" value={`${camera.icon} ${camera.name}`} />
          <Row label="Location" value={camera.location} />
          <Row label="Camera Type" value={camera.cameraType} />
          <Row label="Status" value={camera.status === "online" ? "🟢 Online" : "🔴 Offline"} />
          <Row label="Audio" value={camera.hasAudio ? "আছে" : "নেই"} />
          {camera.status === "offline" && camera.lastConnected && (
            <Row label="Last Connected" value={bnClock(camera.lastConnected.h, camera.lastConnected.m)} />
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold" style={{ color: "#28241f" }}>
                রেকর্ডিং
              </div>
              <div className="text-xs" style={{ color: "#867a65" }}>
                এই ক্যামেরার ফুটেজ সংরক্ষণ চালু/বন্ধ করুন
              </div>
            </div>
            <button
              onClick={() => setCameraRecording(camera.id, !camera.recordingEnabled)}
              className="rounded-full px-3 py-1.5 text-xs font-bold active:scale-95 transition-transform"
              style={{
                background: camera.recordingEnabled ? "#dcf1dc" : "#eeece8",
                color: camera.recordingEnabled ? "#204f25" : "#6b6151",
              }}
            >
              {camera.recordingEnabled ? "🟢 Enabled" : "⚪ Disabled"}
            </button>
          </div>
        </Card>

        <p className="rounded-xl px-3 py-2.5 text-xs" style={{ background: "#f7f7f6", color: "#867a65" }}>
          🔒 নিরাপত্তার জন্য এখানে কোনো ক্যামেরার username/password বা RTSP লিংক দেখানো বা সংরক্ষণ করা হয় না।
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span style={{ color: "#544c40" }}>{label}</span>
      <span className="font-semibold" style={{ color: "#28241f" }}>
        {value}
      </span>
    </div>
  );
}
