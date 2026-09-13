import { useState } from "react";
import Sheet, { Field, inputClass, inputStyle, ChipSelect, PrimaryButton } from "../../components/Sheet.jsx";
import PersonPicker from "../../components/PersonPicker.jsx";
import { useFarm } from "../../store/FarmStore.jsx";
import { EXPENSE_PURPOSES, todayIso, projectById } from "../../data/mockData.js";

export default function NewExpenseSheet({ projectId, onClose, onSaved }) {
  const { currentUser, knownUsers, addTransaction } = useFarm();
  const project = projectById(projectId);
  const [purpose, setPurpose] = useState(EXPENSE_PURPOSES[0]);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(currentUser);
  const [paidTo, setPaidTo] = useState("");
  const [paid, setPaid] = useState(true);

  const canSave = Number(amount) > 0 && paidTo.trim().length > 0 && paidBy.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    addTransaction({
      projectId,
      purpose,
      amount: Number(amount),
      paidBy: paidBy.trim(),
      paidTo: paidTo.trim(),
      paid,
      date: todayIso(),
    });
    onSaved && onSaved();
    onClose();
  };

  return (
    <Sheet
      title={`➕ নতুন হিসাব — ${project.icon} ${project.name}`}
      onClose={onClose}
      footer={
        <PrimaryButton onClick={save} disabled={!canSave}>
          সেভ করুন
        </PrimaryButton>
      }
    >
      <Field label="কেন খরচ হয়েছে?">
        <ChipSelect options={EXPENSE_PURPOSES} value={purpose} onChange={setPurpose} />
      </Field>

      <Field label="কত টাকা খরচ হয়েছে?">
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
        <PersonPicker people={knownUsers} value={paidBy} onChange={setPaidBy} />
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
