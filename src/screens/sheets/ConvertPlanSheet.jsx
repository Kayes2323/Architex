import { useState } from "react";
import Sheet, { Field, inputClass, inputStyle, ChipSelect, PrimaryButton } from "../../components/Sheet.jsx";
import PersonPicker from "../../components/PersonPicker.jsx";
import { useFarm } from "../../store/FarmStore.jsx";
import { PROJECT_TYPES } from "../../data/mockData.js";

export default function ConvertPlanSheet({ plan, onClose, onSaved }) {
  const { currentUser, knownUsers, convertPlanToWork } = useFarm();
  const [title, setTitle] = useState(plan.text);
  const [projectId, setProjectId] = useState(PROJECT_TYPES[0].id);
  const [budget, setBudget] = useState("");
  const [responsible, setResponsible] = useState(currentUser);
  const [deadline, setDeadline] = useState("");

  const canSave = title.trim().length > 0 && responsible.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const project = PROJECT_TYPES.find((p) => p.id === projectId);
    convertPlanToWork(plan.id, {
      title: title.trim(),
      icon: project.icon,
      projectId,
      status: "pending",
      progress: 0,
      totalBudget: Number(budget) || 0,
      spent: 0,
      responsible: responsible.trim(),
      deadline: deadline.trim() || "নির্ধারিত নয়",
      checklist: [{ name: "কাজ শুরু করা", status: "pending" }],
    });
    onSaved && onSaved();
    onClose();
  };

  return (
    <Sheet
      title="🛠️ কাজ হিসেবে শুরু করুন"
      onClose={onClose}
      footer={
        <PrimaryButton onClick={save} disabled={!canSave}>
          কাজ তৈরি করুন
        </PrimaryButton>
      }
    >
      <p className="mb-3 rounded-xl px-3 py-2 text-xs" style={{ background: "#f0f9f0", color: "#204f25" }}>
        💡 মূল পরিকল্পনা: {plan.text}
      </p>

      <Field label="কাজের নাম">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} style={inputStyle} />
      </Field>

      <Field label="কোন প্রজেক্ট?">
        <ChipSelect
          options={PROJECT_TYPES}
          value={projectId}
          onChange={setProjectId}
          getKey={(o) => o.id}
          getLabel={(o) => `${o.icon} ${o.name}`}
        />
      </Field>

      <Field label="আনুমানিক বাজেট (ঐচ্ছিক)">
        <input
          type="number"
          inputMode="numeric"
          placeholder="৳"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <Field label="দায়িত্বে কে থাকবে?">
        <PersonPicker people={knownUsers} value={responsible} onChange={setResponsible} />
      </Field>

      <Field label="সম্ভাব্য শেষের তারিখ (ঐচ্ছিক)">
        <input
          type="text"
          placeholder="যেমন: ২০ অক্টোবর"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </Field>
    </Sheet>
  );
}
