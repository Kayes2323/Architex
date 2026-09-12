import { useState } from "react";
import DashboardScreen from "./DashboardScreen.jsx";
import CameraDetailScreen from "./CameraDetailScreen.jsx";
import RecordingHistoryScreen from "./RecordingHistoryScreen.jsx";
import AlertsScreen from "./AlertsScreen.jsx";
import CameraSettingsScreen from "./CameraSettingsScreen.jsx";

export default function CCTVModule({ onExit }) {
  const [view, setView] = useState({ screen: "dashboard" });

  const openCamera = (cameraId) => setView({ screen: "camera", cameraId });
  const openRecording = () => setView({ screen: "recording" });
  const openAlerts = () => setView({ screen: "alerts" });
  const openSettings = (cameraId) => setView({ screen: "settings", cameraId });
  const backToDashboard = () => setView({ screen: "dashboard" });

  if (view.screen === "camera") {
    return (
      <CameraDetailScreen
        cameraId={view.cameraId}
        onBack={backToDashboard}
        onSwitchCamera={(id) => setView({ screen: "camera", cameraId: id })}
        onOpenSettings={openSettings}
      />
    );
  }

  if (view.screen === "recording") {
    return <RecordingHistoryScreen onBack={backToDashboard} />;
  }

  if (view.screen === "alerts") {
    return <AlertsScreen onBack={backToDashboard} onOpenCamera={openCamera} onOpenRecording={openRecording} />;
  }

  if (view.screen === "settings") {
    return <CameraSettingsScreen cameraId={view.cameraId} onBack={() => openCamera(view.cameraId)} />;
  }

  return (
    <DashboardScreen onExit={onExit} onOpenCamera={openCamera} onOpenAlerts={openAlerts} onOpenRecording={openRecording} />
  );
}
