import { ScreenHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { PROJECT_TYPES, computeFinancialSummary, projectTotal, formatTaka } from "../data/mockData.js";

export default function AccountingScreen({ onOpenProject }) {
  const { transactions } = useFarm();
  const summary = computeFinancialSummary(transactions);

  return (
    <div className="pb-24">
      <ScreenHeader title="💰 হিসাব" />

      <div className="px-4 pt-4 flex flex-col gap-4">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: "#28241f" }}>
              সব প্রজেক্টের মোট হিসাব
            </span>
            <span className="rounded-full bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700">
              সেটআপ পর্যায়
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat icon="💰" label="মোট বিনিয়োগ" value={formatTaka(summary.totalInvestment)} highlight />
            <Stat icon="💸" label="মোট খরচ" value={formatTaka(summary.totalExpense)} />
            <Stat icon="💳" label="মোট বাকি" value={formatTaka(summary.totalDue)} tone={summary.totalDue > 0 ? "alert" : "default"} />
            <Stat icon="💵" label="মোট আয়" value={formatTaka(summary.totalIncome)} />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed" style={{ color: "#867a65" }}>
            এখন ফার্ম শুরু ও বিনিয়োগ পর্যায় চলছে, তাই লাভ-ক্ষতি এখনও দেখানো হচ্ছে না। আয় শুরু হলে এখানে লাভ/ক্ষতির হিসাব যুক্ত হবে।
          </p>
        </Card>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold" style={{ color: "#28241f" }}>
              প্রজেক্ট অনুযায়ী হিসাব
            </h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {PROJECT_TYPES.map((p) => {
              const total = projectTotal(transactions, p.id);
              return (
                <Card key={p.id} onClick={() => onOpenProject(p.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-sm font-bold" style={{ color: "#28241f" }}>
                        {p.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-extrabold" style={{ color: "#2f7d35" }}>
                        {formatTaka(total)}
                      </span>
                      <span style={{ color: "#c3bcae" }}>›</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <p className="text-center text-xs" style={{ color: "#867a65" }}>
          হিসাব যোগ করতে উপরের যেকোনো প্রজেক্টে ঢুকুন 👆
        </p>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone, highlight }) {
  const alert = tone === "alert";
  return (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{
        background: alert ? "#fdf1f0" : highlight ? "#f0f9f0" : "#f7f7f6",
        border: `1px solid ${alert ? "#f7c1bb" : highlight ? "#b9e3ba" : "#eeece8"}`,
      }}
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
