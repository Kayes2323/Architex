import { useState } from "react";
import Sheet, { Field, inputClass, inputStyle, ChipSelect, PrimaryButton } from "../../components/Sheet.jsx";
import { useFarm } from "../../store/FarmStore.jsx";
import { PROJECT_TYPES, EXPENSE_PURPOSES, FAMILY_MEMBERS, TODAY_ISO } from "../../data/mockData.js";

export default function NewExpenseSheet({ defaultProjectId, onClose, onSaved }) {
  const { addTransaction } = useFarm();
  const [purpose, setPurpose] = useState(EXPENSE_PURPOSES[0]);
  const [projectId, setProjectId] = useState(defaultProjectId || PROJECT_TYPES[0].id);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(FAMILY_MEMBERS[0]);
  const [paidTo, setPaidTo] = useState("");
  const [paid, setPaid] = useState(true);

  const canSave = Number(amount) > 0 && paidTo.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    addTransaction({
      projectId,
      purpose,
      amount: Number(amount),
      paidBy,
      paidTo: paidTo.trim(),
      paid,
      date: TODAY_ISO,
    });
    onSaved && onSaved();
    onClose();
  };

  return (
    <Sheet
      title="➕ নতুন হিসাব"
      onClose={onClose}
      footer={
        <PrimaryButton onClick={save} disabled={!canSave}>
          সেভ করুন
        </PrimaryButton>
      }
    >
      <Field label="কী জন্য?">
        <ChipSelect options={EXPENSE_PURPOSES} value={purpose} onChange={setPurpose} />
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

      <Field label="কত টাকা?">
        <input
          type="number"
          inputMode="numeric"
          placeholder="৳ ৩,০০০"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <Field label="কে টাকা দিয়েছে?">
        <ChipSelect options={FAMILY_MEMBERS} value={paidBy} onChange={setPaidBy} />
      </Field>

      <Field label="কাকে দেওয়া হয়েছে?">
        <input
          type="text"
          placeholder="যেমন: দোকান, শ্রমিক, হাট"
          value={paidTo}
          onChange={(e) => setPaidTo(e.target.value)}
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <Field label="পরিশোধ হয়েছে?">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPaid(true)}
            className="flex-1 rounded-xl border py-2.5 text-sm font-bold active:scale-95 transition-transform"
            style={{
              borderColor: paid ? "#2f7d35" : "#dedad2",
              background: paid ? "#dcf1dc" : "#fff",
              color: paid ? "#204f25" : "#867a65",
            }}
          >
            🟢 হ্যাঁ
          </button>
          <button
            type="button"
            onClick={() => setPaid(false)}
            className="flex-1 rounded-xl border py-2.5 text-sm font-bold active:scale-95 transition-transform"
            style={{
              borderColor: !paid ? "#bd4038" : "#dedad2",
              background: !paid ? "#fbdedb" : "#fff",
              color: !paid ? "#7c2e2b" : "#867a65",
            }}
          >
            🔴 না
          </button>
        </div>
      </Field>
    </Sheet>
  );
}
