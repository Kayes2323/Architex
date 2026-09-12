import { AppHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { computeTodaySummary, formatTaka, bnDate, toBnNumerals, TODAY_ISO } from "../data/mockData.js";

export default function HomeScreen({ onOpenNewUpdate, onGoToHisab, onQuickAddPlan }) {
  const { transactions, works, todayUpdates } = useFarm();
  const summary = computeTodaySummary(transactions, works);

  return (
    <div className="pb-24">
      <AppHeader subtitle={bnDate(TODAY_ISO)} />

      <div className="px-4 -mt-1 flex flex-col gap-4 pt-4">
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold" style={{ color: "#28241f" }}>
              📢 আজকের আপডেট
            </h2>
            <button
              onClick={onOpenNewUpdate}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-white active:scale-95 transition-transform"
              style={{ background: "#2f7d35" }}
            >
              + আজকের আপডেট দিন
            </button>
          </div>

          <Card>
            <div className="mb-3 text-sm font-bold" style={{ color: "#28241f" }}>
              আজকের সারাংশ
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SummaryStat icon="💰" label="আজকের খরচ" value={formatTaka(summary.expenseToday)} />
              <SummaryStat icon="🛠️" label="চলমান কাজ" value={`${toBnNumerals(summary.running)}টি`} />
              <SummaryStat icon="✅" label="আজ সম্পন্ন" value={`${toBnNumerals(summary.doneToday)}টি`} />
              <SummaryStat
                icon="⚠️"
                label="সমস্যা"
                value={`${toBnNumerals(summary.problems)}টি`}
                alert={summary.problems > 0}
              />
            </div>
          </Card>

          {todayUpdates.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {todayUpdates.slice(0, 4).map((u) => (
                <div key={u.id} className="flex gap-2 rounded-xl bg-white px-3 py-2.5 shadow-card">
                  <span className="text-base leading-none">📝</span>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: "#3d3830" }}>
                      {u.text}
                    </p>
                    <p className="mt-0.5 text-[11px]" style={{ color: "#867a65" }}>
                      {u.author} · {u.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
            দ্রুত অ্যাকশন
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction icon="💰" label="টাকা খরচ হয়েছে?" sub="হিসাব দিন" onClick={onGoToHisab} />
            <QuickAction icon="📋" label="নতুন আইডিয়া আছে?" sub="পরিকল্পনা দিন" onClick={onQuickAddPlan} />
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryStat({ icon, label, value, alert }) {
  return (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{ background: alert ? "#fdf1f0" : "#f7f7f6", border: `1px solid ${alert ? "#f7c1bb" : "#eeece8"}` }}
    >
      <div className="text-[11px] font-medium" style={{ color: alert ? "#973430" : "#867a65" }}>
        {icon} {label}
      </div>
      <div className="mt-0.5 text-base font-extrabold" style={{ color: alert ? "#973430" : "#28241f" }}>
        {value}
      </div>
    </div>
  );
}

function QuickAction({ icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-1 rounded-2xl border bg-white p-3.5 text-left shadow-card active:scale-[0.98] transition-transform"
      style={{ borderColor: "#eeece8" }}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-bold" style={{ color: "#28241f" }}>
        {label}
      </span>
      <span className="text-xs font-semibold" style={{ color: "#2f7d35" }}>
        {sub} →
      </span>
    </button>
  );
}
