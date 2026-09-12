import { useState } from "react";
import { ScreenHeader } from "../components/TopHeader.jsx";
import Card from "../components/Card.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { ChipSelect } from "../components/Sheet.jsx";
import PersonPicker from "../components/PersonPicker.jsx";
import { useFarm } from "../store/FarmStore.jsx";
import { STATUS, formatTaka, projectById, toBnNumerals } from "../data/mockData.js";

const CHECK_CYCLE = ["pending", "running", "done", "problem"];

export default function WorkDetailScreen({ workId, onBack }) {
  const { works, knownUsers, updateWorkProgress } = useFarm();
  const work = works.find((w) => w.id === workId);
  const [editingResponsible, setEditingResponsible] = useState(false);

  if (!work) {
    return (
      <div className="pb-24">
        <ScreenHeader title="কাজ পাওয়া যায়নি" onBack={onBack} />
      </div>
    );
  }

  const proj = projectById(work.projectId);
  const remaining = Math.max(0, work.totalBudget - work.spent);

  const cycleChecklist = (idx) => {
    const item = work.checklist[idx];
    const nextStatus = CHECK_CYCLE[(CHECK_CYCLE.indexOf(item.status) + 1) % CHECK_CYCLE.length];
    const checklist = work.checklist.map((c, i) => (i === idx ? { ...c, status: nextStatus } : c));
    updateWorkProgress(work.id, { checklist });
  };

  const setProgress = (val) => {
    updateWorkProgress(work.id, { progress: Number(val) });
  };

  const setStatus = (key) => {
    updateWorkProgress(work.id, { status: key });
  };

  return (
    <div className="pb-24">
      <ScreenHeader title={`${work.icon} ${work.title}`} onBack={onBack} />

      <div className="px-4 pt-4 flex flex-col gap-4">
        <Card tone={work.status === "problem" ? "alert" : "default"}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs" style={{ color: "#867a65" }}>
              {proj.icon} {proj.name}
            </span>
            <StatusBadge status={work.status} />
          </div>
          <div className="mb-1 text-sm font-bold" style={{ color: "#28241f" }}>
            অগ্রগতি: {toBnNumerals(work.progress)}% সম্পন্ন
          </div>
          <ProgressBar percent={work.progress} tone={work.status === "problem" ? "alert" : "brand"} />
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={work.progress}
            onChange={(e) => setProgress(e.target.value)}
            className="mt-3 w-full accent-brand-600"
          />
          <div className="mt-1 text-[11px]" style={{ color: "#867a65" }}>
            ↑ টেনে অগ্রগতি আপডেট করুন
          </div>
        </Card>

        <Card>
          <div className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
            অবস্থা পরিবর্তন করুন
          </div>
          <ChipSelect
            options={Object.values(STATUS)}
            value={work.status}
            onChange={setStatus}
            getKey={(o) => o.key}
            getLabel={(o) => `${o.dot} ${o.label}`}
          />
        </Card>

        <Card>
          <div className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
            কাজের তালিকা
          </div>
          <div className="flex flex-col gap-1.5">
            {work.checklist.map((c, idx) => (
              <button
                key={c.name}
                onClick={() => cycleChecklist(idx)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-left active:scale-[0.98] transition-transform"
                style={{ background: "#f7f7f6" }}
              >
                <span className="text-sm" style={{ color: "#28241f" }}>
                  {c.name}
                </span>
                <StatusBadge status={c.status} size="sm" />
              </button>
            ))}
          </div>
          <div className="mt-2 text-[11px]" style={{ color: "#867a65" }}>
            যেকোনো ধাপে ট্যাপ করলে অবস্থা পাল্টাবে।
          </div>
        </Card>

        <Card>
          <div className="mb-2 text-sm font-bold" style={{ color: "#28241f" }}>
            আর্থিক তথ্য
          </div>
          <Row label="মোট আনুমানিক খরচ" value={formatTaka(work.totalBudget)} />
          <Row label="এখন পর্যন্ত খরচ" value={formatTaka(work.spent)} />
          <Row label="বাজেটের বাকি" value={formatTaka(remaining)} strong />
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold" style={{ color: "#28241f" }}>
              👤 দায়িত্বে
            </span>
            <button
              onClick={() => setEditingResponsible((v) => !v)}
              className="text-xs font-semibold"
              style={{ color: "#2f7d35" }}
            >
              {editingResponsible ? "বন্ধ করুন" : "পরিবর্তন করুন"}
            </button>
          </div>
          {editingResponsible ? (
            <PersonPicker
              people={knownUsers}
              value={work.responsible}
              onChange={(v) => updateWorkProgress(work.id, { responsible: v })}
            />
          ) : (
            <span className="text-sm" style={{ color: "#3d3830" }}>
              {work.responsible}
            </span>
          )}
          <div className="mt-3 border-t pt-3 text-sm" style={{ borderColor: "#eeece8", color: "#3d3830" }}>
            📅 সম্ভাব্য শেষ: <span className="font-semibold">{work.deadline}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span style={{ color: "#544c40" }}>{label}</span>
      <span className={strong ? "font-extrabold" : "font-semibold"} style={{ color: strong ? "#2f7d35" : "#28241f" }}>
        {value}
      </span>
    </div>
  );
}
