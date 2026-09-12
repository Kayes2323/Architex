import { ScreenHeader } from "../components/TopHeader.jsx";
import FarmDesigner from "../farm3d/FarmDesigner.jsx";

export default function Farm3DScreen({ onBack }) {
  return (
    <div className="pb-24">
      <ScreenHeader title="🗺️ Farm 3D Model" onBack={onBack} />
      <FarmDesigner />
    </div>
  );
}
