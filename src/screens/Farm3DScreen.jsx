import { ScreenHeader } from "../components/TopHeader.jsx";
import FarmDesigner from "../farm3d/FarmDesigner.jsx";

export default function Farm3DScreen({ onBack, onOpenCCTV }) {
  return (
    <div className="pb-24">
      <ScreenHeader title="🗺️ Farm 3D Model" onBack={onBack} />
      {onOpenCCTV && (
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#f0f9f0", border: "1px solid #b9e3ba" }}>
          <span className="text-lg">🔮</span>
          <p className="flex-1 text-xs" style={{ color: "#204f25" }}>
            ভবিষ্যতে এই ৩ডি মডেলের প্রতিটি zone থেকে সরাসরি CCTV দেখা যাবে।
          </p>
          <button
            onClick={onOpenCCTV}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-white active:scale-95 transition-transform"
            style={{ background: "#2f7d35" }}
          >
            📹 CCTV দেখুন
          </button>
        </div>
      )}
      <FarmDesigner />
    </div>
  );
}
