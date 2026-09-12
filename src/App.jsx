import { useState } from "react";
import { FarmStoreProvider } from "./store/FarmStore.jsx";
import BottomNav from "./components/BottomNav.jsx";

import HomeScreen from "./screens/HomeScreen.jsx";
import AccountingScreen from "./screens/AccountingScreen.jsx";
import ProjectDetailScreen from "./screens/ProjectDetailScreen.jsx";
import WorkListScreen from "./screens/WorkListScreen.jsx";
import WorkDetailScreen from "./screens/WorkDetailScreen.jsx";
import PlanScreen from "./screens/PlanScreen.jsx";
import Farm3DScreen from "./screens/Farm3DScreen.jsx";

import NewExpenseSheet from "./screens/sheets/NewExpenseSheet.jsx";
import NewPlanSheet from "./screens/sheets/NewPlanSheet.jsx";
import NewUpdateSheet from "./screens/sheets/NewUpdateSheet.jsx";
import ConvertPlanSheet from "./screens/sheets/ConvertPlanSheet.jsx";

export default function App() {
  return (
    <FarmStoreProvider>
      <AppShell />
    </FarmStoreProvider>
  );
}

function AppShell() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [show3D, setShow3D] = useState(false);
  const [sheet, setSheet] = useState(null); // { type, ...params }

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSelectedWorkId(null);
    setSelectedProjectId(null);
    setShow3D(false);
  };

  const openWork = (workId) => {
    setActiveTab("kaj");
    setSelectedWorkId(workId);
  };

  const closeSheet = () => setSheet(null);

  return (
    <div style={{ background: "#f2f6f1", minHeight: "100%" }}>
      <div className="mx-auto min-h-full max-w-md" style={{ background: "#f2f6f1" }}>
        {activeTab === "home" && (
          <HomeScreen
            onOpenWork={openWork}
            onOpenNewUpdate={() => setSheet({ type: "newUpdate" })}
            onQuickAddExpense={() => setSheet({ type: "newExpense" })}
            onQuickAddPlan={() => setSheet({ type: "newPlan" })}
          />
        )}

        {activeTab === "hisab" &&
          (selectedProjectId ? (
            <ProjectDetailScreen
              projectId={selectedProjectId}
              onBack={() => setSelectedProjectId(null)}
              onAddExpense={(projectId) => setSheet({ type: "newExpense", projectId })}
            />
          ) : (
            <AccountingScreen
              onOpenProject={setSelectedProjectId}
              onAddExpense={() => setSheet({ type: "newExpense" })}
            />
          ))}

        {activeTab === "kaj" &&
          (selectedWorkId ? (
            <WorkDetailScreen workId={selectedWorkId} onBack={() => setSelectedWorkId(null)} />
          ) : (
            <WorkListScreen onOpenWork={setSelectedWorkId} />
          ))}

        {activeTab === "plan" &&
          (show3D ? (
            <Farm3DScreen onBack={() => setShow3D(false)} />
          ) : (
            <PlanScreen
              onNewPlan={() => setSheet({ type: "newPlan" })}
              onOpen3D={() => setShow3D(true)}
              onOpenWork={openWork}
              onConvertToWork={(plan) => setSheet({ type: "convertPlan", plan })}
            />
          ))}

        <BottomNav active={activeTab} onChange={switchTab} />

        {sheet && sheet.type === "newExpense" && (
          <NewExpenseSheet defaultProjectId={sheet.projectId} onClose={closeSheet} />
        )}
        {sheet && sheet.type === "newPlan" && <NewPlanSheet onClose={closeSheet} />}
        {sheet && sheet.type === "newUpdate" && <NewUpdateSheet onClose={closeSheet} />}
        {sheet && sheet.type === "convertPlan" && <ConvertPlanSheet plan={sheet.plan} onClose={closeSheet} />}
      </div>
    </div>
  );
}
