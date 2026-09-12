import { useMemo, useState } from "react";
import { ScreenHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import Avatar from "../components/Avatar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { ChipSelect, inputClass, inputStyle } from "../components/Sheet.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { FAMILY_MEMBERS, relativeBnTime } from "../data/mockData.js";

export default function PlanScreen({ onNewPlan, onOpen3D, onOpenWork, onConvertToWork }) {
  const { plans, currentUser, setCurrentUser, addComment } = useFarm();
  const [query, setQuery] = useState("");
  const [switchingUser, setSwitchingUser] = useState(false);

  const sorted = useMemo(
    () => [...plans].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [plans]
  );
  const filtered = query.trim()
    ? sorted.filter(
        (p) =>
          p.text.includes(query.trim()) ||
          p.author.includes(query.trim()) ||
          p.comments.some((c) => c.text.includes(query.trim()))
      )
    : sorted;

  return (
    <div className="pb-24">
      <ScreenHeader
        title="📋 পরিকল্পনা ও আলোচনা"
        right={
          <button
            onClick={() => setSwitchingUser((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border px-2 py-1 active:scale-95 transition-transform"
            style={{ borderColor: "#dedad2" }}
          >
            <Avatar name={currentUser} size={22} />
            <span className="text-xs font-semibold" style={{ color: "#3d3830" }}>
              {currentUser}
            </span>
          </button>
        }
      />

      {switchingUser && (
        <div className="border-b bg-white px-4 py-3" style={{ borderColor: "#eeece8" }}>
          <div className="mb-1.5 text-xs font-semibold" style={{ color: "#867a65" }}>
            আপনি এখন কে হিসেবে আছেন?
          </div>
          <ChipSelect
            options={FAMILY_MEMBERS}
            value={currentUser}
            onChange={(v) => {
              setCurrentUser(v);
              setSwitchingUser(false);
            }}
          />
        </div>
      )}

      <div className="px-4 pt-4 flex flex-col gap-4">
        <button
          onClick={onOpen3D}
          className="flex items-center gap-3 rounded-2xl p-4 text-left text-white shadow-card active:scale-[0.98] transition-transform"
          style={{ background: "linear-gradient(135deg,#2f7d35,#26632b)" }}
        >
          <span className="text-3xl leading-none">🗺️</span>
          <div className="flex-1">
            <div className="text-sm font-extrabold">Farm 3D Model</div>
            <div className="text-xs" style={{ color: "#dcf1dc" }}>
              পুরো ফার্মের ৩ডি লেআউট দেখুন ও ডিজাইন করুন
            </div>
          </div>
          <span className="text-lg">›</span>
        </button>

        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 পুরোনো পরিকল্পনা খুঁজুন..."
            className={inputClass + " flex-1"}
            style={inputStyle}
          />
          <button
            onClick={onNewPlan}
            className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold text-white active:scale-95 transition-transform"
            style={{ background: "#2f7d35" }}
          >
            + নতুন
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="💡" title="কোনো পরিকল্পনা পাওয়া যায়নি" subtitle="নতুন একটা আইডিয়া যোগ করুন।" />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentUser={currentUser}
                onOpenWork={onOpenWork}
                onConvertToWork={onConvertToWork}
                onReply={(text) => addComment(plan.id, { author: currentUser, text, createdAt: new Date().toISOString() })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ plan, currentUser, onOpenWork, onConvertToWork, onReply }) {
  const [reply, setReply] = useState("");

  const send = () => {
    if (!reply.trim()) return;
    onReply(reply.trim());
    setReply("");
  };

  return (
    <Card>
      <div className="flex items-start gap-2.5">
        <Avatar name={plan.author} />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold" style={{ color: "#28241f" }}>
              {plan.author}
            </span>
            <span className="text-[11px]" style={{ color: "#867a65" }}>
              · {relativeBnTime(plan.createdAt)}
            </span>
          </div>
          <p className="mt-1 flex items-start gap-1.5 text-sm" style={{ color: "#3d3830" }}>
            <span>💡</span>
            <span>{plan.text}</span>
          </p>

          {plan.convertedToWorkId ? (
            <button
              onClick={() => onOpenWork(plan.convertedToWorkId)}
              className="mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold active:scale-95 transition-transform"
              style={{ borderColor: "#b9e3ba", background: "#f0f9f0", color: "#204f25" }}
            >
              ✅ কাজে রূপান্তরিত হয়েছে — দেখুন
            </button>
          ) : (
            <button
              onClick={() => onConvertToWork(plan)}
              className="mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold active:scale-95 transition-transform"
              style={{ borderColor: "#dedad2", color: "#2f7d35" }}
            >
              🛠️ কাজ হিসেবে শুরু করুন
            </button>
          )}
        </div>
      </div>

      {plan.comments.length > 0 && (
        <div className="mt-3 flex flex-col gap-2 border-t pt-3" style={{ borderColor: "#eeece8" }}>
          {plan.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2 pl-2">
              <Avatar name={c.author} size={24} />
              <div>
                <div className="text-xs">
                  <span className="font-bold" style={{ color: "#28241f" }}>
                    {c.author}
                  </span>{" "}
                  <span style={{ color: "#867a65" }}>· {relativeBnTime(c.createdAt)}</span>
                </div>
                <div className="text-sm" style={{ color: "#3d3830" }}>
                  {c.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 border-t pt-3" style={{ borderColor: "#eeece8" }}>
        <Avatar name={currentUser} size={24} />
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="মন্তব্য লিখুন..."
          className="flex-1 rounded-full border px-3 py-1.5 text-sm outline-none focus:border-brand-500"
          style={{ borderColor: "#dedad2" }}
        />
        <button
          onClick={send}
          disabled={!reply.trim()}
          className="rounded-full px-3 py-1.5 text-xs font-bold text-white disabled:opacity-30 active:scale-95 transition-transform"
          style={{ background: "#2f7d35" }}
        >
          পাঠান
        </button>
      </div>
    </Card>
  );
}
