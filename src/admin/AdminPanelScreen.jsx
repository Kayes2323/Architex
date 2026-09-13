import { ScreenHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useFarm, ADMIN_EMAIL } from "../store/FarmStore.jsx";

export default function AdminPanelScreen({ onExit }) {
  const { profiles, approveUser, rejectUser } = useFarm();

  const pending = profiles.filter((p) => p.status === "pending");
  const approved = profiles.filter((p) => p.status === "approved" && p.email !== ADMIN_EMAIL);
  const rejected = profiles.filter((p) => p.status === "rejected");

  return (
    <div className="pb-24">
      <ScreenHeader title="🛡️ অ্যাডমিন প্যানেল" onBack={onExit} />

      <div className="px-4 pt-4 flex flex-col gap-5">
        <section>
          <h2 className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
            🕐 অনুমোদনের অপেক্ষায় ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <EmptyState icon="✅" title="কোনো নতুন অনুরোধ নেই" />
          ) : (
            <div className="flex flex-col gap-2.5">
              {pending.map((p) => (
                <Card key={p.id} tone="alert">
                  <div className="mb-2">
                    <div className="text-sm font-bold" style={{ color: "#28241f" }}>
                      {p.name || "(নাম নেই)"}
                    </div>
                    <div className="text-xs" style={{ color: "#867a65" }}>
                      {p.email}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveUser(p.id)}
                      className="flex-1 rounded-xl py-2 text-sm font-bold text-white active:scale-95 transition-transform"
                      style={{ background: "#2f7d35" }}
                    >
                      ✅ অনুমোদন দিন
                    </button>
                    <button
                      onClick={() => rejectUser(p.id)}
                      className="flex-1 rounded-xl border py-2 text-sm font-bold active:scale-95 transition-transform"
                      style={{ borderColor: "#f7c1bb", color: "#bd4038" }}
                    >
                      ❌ বাতিল
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
            ✅ অনুমোদিত সদস্য ({approved.length})
          </h2>
          {approved.length === 0 ? (
            <EmptyState icon="👥" title="এখনো কেউ অনুমোদিত হয়নি" />
          ) : (
            <div className="flex flex-col gap-2">
              {approved.map((p) => (
                <Card key={p.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold" style={{ color: "#28241f" }}>
                        {p.name || "(নাম নেই)"}
                      </div>
                      <div className="text-xs" style={{ color: "#867a65" }}>
                        {p.email}
                      </div>
                    </div>
                    <button
                      onClick={() => rejectUser(p.id)}
                      className="rounded-full px-3 py-1.5 text-xs font-bold active:scale-95 transition-transform"
                      style={{ background: "#fdf1f0", color: "#bd4038" }}
                    >
                      অ্যাক্সেস বাতিল
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {rejected.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
              🚫 বাতিলকৃত ({rejected.length})
            </h2>
            <div className="flex flex-col gap-2">
              {rejected.map((p) => (
                <Card key={p.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold" style={{ color: "#28241f" }}>
                        {p.name || "(নাম নেই)"}
                      </div>
                      <div className="text-xs" style={{ color: "#867a65" }}>
                        {p.email}
                      </div>
                    </div>
                    <button
                      onClick={() => approveUser(p.id)}
                      className="rounded-full px-3 py-1.5 text-xs font-bold active:scale-95 transition-transform"
                      style={{ background: "#dcf1dc", color: "#204f25" }}
                    >
                      পুনরায় অনুমোদন
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
