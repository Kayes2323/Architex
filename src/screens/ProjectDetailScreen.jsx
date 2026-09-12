import { ScreenHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { projectById, projectTransactions, formatTaka, bnDate } from "../data/mockData.js";

export default function ProjectDetailScreen({ projectId, onBack, onAddExpense }) {
  const { transactions } = useFarm();
  const project = projectById(projectId);
  const items = projectTransactions(transactions, projectId).sort((a, b) => (a.date < b.date ? 1 : -1));
  const total = items.reduce((s, t) => s + Number(t.amount || 0), 0);

  const grouped = {};
  items.forEach((t) => {
    grouped[t.purpose] = (grouped[t.purpose] || 0) + Number(t.amount || 0);
  });

  return (
    <div className="pb-24">
      <ScreenHeader title={`${project.icon} ${project.name}`} onBack={onBack} />

      <div className="px-4 pt-4 flex flex-col gap-4">
        {items.length === 0 ? (
          <EmptyState icon="🧾" title="এখনো কোনো হিসাব নেই" subtitle="নতুন হিসাব যোগ করে শুরু করুন।" />
        ) : (
          <>
            <Card>
              <div className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
                {project.name} — খরচের সারাংশ
              </div>
              <div className="flex flex-col gap-1.5">
                {Object.entries(grouped).map(([purpose, amt]) => (
                  <div key={purpose} className="flex items-center justify-between text-sm">
                    <span style={{ color: "#544c40" }}>{purpose}</span>
                    <span className="font-semibold" style={{ color: "#28241f" }}>
                      {formatTaka(amt)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between border-t pt-2" style={{ borderColor: "#eeece8" }}>
                <span className="text-sm font-bold" style={{ color: "#28241f" }}>
                  মোট
                </span>
                <span className="text-base font-extrabold" style={{ color: "#2f7d35" }}>
                  {formatTaka(total)}
                </span>
              </div>
            </Card>

            <section>
              <h2 className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
                সব লেনদেন
              </h2>
              <div className="flex flex-col gap-2">
                {items.map((t) => (
                  <Card key={t.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold" style={{ color: "#28241f" }}>
                          {t.purpose}
                        </div>
                        <div className="mt-0.5 text-xs" style={{ color: "#867a65" }}>
                          {t.paidBy} দিয়েছেন · {t.paidTo}কে · {bnDate(t.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold" style={{ color: "#28241f" }}>
                          {formatTaka(t.amount)}
                        </div>
                        <div
                          className="mt-0.5 text-[11px] font-semibold"
                          style={{ color: t.paid ? "#2f7d35" : "#bd4038" }}
                        >
                          {t.paid ? "🟢 পরিশোধ হয়েছে" : "🔴 বাকি আছে"}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <button
        onClick={() => onAddExpense(projectId)}
        className="fixed bottom-20 right-4 z-30 flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold text-white shadow-pop active:scale-95 transition-transform"
        style={{ background: "#2f7d35" }}
      >
        <span className="text-lg leading-none">➕</span> নতুন হিসাব
      </button>
    </div>
  );
}
