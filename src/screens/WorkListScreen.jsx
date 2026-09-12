import { useMemo } from "react";
import { ScreenHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { formatTaka, projectById } from "../data/mockData.js";

const GROUPS = [
  { key: "running", title: "🟢 চলমান কাজ" },
  { key: "problem", title: "🔴 সমস্যা আছে" },
  { key: "pending", title: "🟡 অপেক্ষমাণ কাজ" },
  { key: "done", title: "✅ শেষ হওয়া কাজ" },
];

export default function WorkListScreen({ onOpenWork }) {
  const { works } = useFarm();
  const grouped = useMemo(() => {
    const map = { running: [], problem: [], pending: [], done: [] };
    works.forEach((w) => map[w.status]?.push(w));
    return map;
  }, [works]);

  return (
    <div className="pb-24">
      <ScreenHeader title="🛠️ কাজ" />
      <div className="px-4 pt-4 flex flex-col gap-5">
        {GROUPS.map((g) => {
          const items = grouped[g.key];
          if (!items || items.length === 0) return null;
          return (
            <section key={g.key}>
              <h2 className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
                {g.title} ({items.length})
              </h2>
              <div className="flex flex-col gap-2.5">
                {items.map((w) => {
                  const proj = projectById(w.projectId);
                  return (
                    <Card key={w.id} onClick={() => onOpenWork(w.id)} tone={w.status === "problem" ? "alert" : "default"}>
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl leading-none">{w.icon}</span>
                          <div>
                            <div className="text-sm font-bold" style={{ color: "#28241f" }}>
                              {w.title}
                            </div>
                            <div className="text-[11px]" style={{ color: "#867a65" }}>
                              {proj.icon} {proj.name}
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={w.status} size="sm" />
                      </div>
                      <ProgressBar percent={w.progress} tone={w.status === "problem" ? "alert" : "brand"} />
                      <div className="mt-2 flex items-center justify-between text-xs" style={{ color: "#6b6151" }}>
                        <span>👤 {w.responsible}</span>
                        <span>💰 {formatTaka(w.spent)} / {formatTaka(w.totalBudget)}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
