import { useState } from "react";
import Sheet, { Field, inputClass, inputStyle, PrimaryButton } from "../../components/Sheet.jsx";
import PersonPicker from "../../components/PersonPicker.jsx";
import { useFarm } from "../../store/FarmStore.jsx";
import { EXPENSE_PURPOSES, todayIso, projectById } from "../../data/mockData.js";

export default function NewExpenseSheet({ projectId, onClose, onSaved }) {
  const { currentUser, knownUsers, addTransaction } = useFarm();
  const project = projectById(projectId);

  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState("");
  const [customPurpose, setCustomPurpose] = useState(false);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(currentUser);
  const [notPaidYet, setNotPaidYet] = useState(false);
  const [paidTo, setPaidTo] = useState("");
  const [paid, setPaid] = useState(true);

  const steps = notPaidYet ? ["purpose", "amount", "paidBy"] : ["purpose", "amount", "paidBy", "paidTo", "paid"];
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const canNext =
    current === "purpose"
      ? purpose.trim().length > 0
      : current === "amount"
      ? Number(amount) > 0
      : current === "paidBy"
      ? notPaidYet || paidBy.trim().length > 0
      : current === "paidTo"
      ? paidTo.trim().length > 0
      : true;

  const save = () => {
    addTransaction({
      projectId,
      purpose: purpose.trim(),
      amount: Number(amount),
      paidBy: notPaidYet ? "" : paidBy.trim(),
      paidTo: notPaidYet ? "" : paidTo.trim(),
      paid: notPaidYet ? false : paid,
      notPaidYet,
      date: todayIso(),
    });
    onSaved && onSaved();
    onClose();
  };

  const goNext = () => {
    if (!canNext) return;
    if (isLast) save();
    else setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => s - 1);

  return (
    <Sheet
      title={`➕ নতুন হিসাব — ${project.icon} ${project.name}`}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border px-4 py-3 text-sm font-bold active:scale-95 transition-transform"
              style={{ borderColor: "#dedad2", color: "#544c40" }}
            >
              ← পেছনে
            </button>
          )}
          <div className="flex-1">
            <PrimaryButton onClick={goNext} disabled={!canNext}>
              {isLast ? "সেভ করুন" : "পরবর্তী →"}
            </PrimaryButton>
          </div>
        </div>
      }
    >
      <div className="mb-4 flex items-center gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{ background: i <= step ? "#2f7d35" : "#eeece8" }}
          />
        ))}
      </div>

      {current === "purpose" && (
        <Field label="কেন খরচ হয়েছে?">
          <div className="flex flex-wrap gap-2">
            {EXPENSE_PURPOSES.map((p) => {
              const active = !customPurpose && purpose === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setCustomPurpose(false);
                    setPurpose(p);
                  }}
                  className="rounded-full border px-3.5 py-2 text-sm font-medium active:scale-95 transition-transform"
                  style={{
                    borderColor: active ? "#2f7d35" : "#dedad2",
                    background: active ? "#dcf1dc" : "#fff",
                    color: active ? "#204f25" : "#544c40",
                  }}
                >
                  {p}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setCustomPurpose(true);
                setPurpose("");
              }}
              className="rounded-full border px-3.5 py-2 text-sm font-medium active:scale-95 transition-transform"
              style={{
                borderColor: customPurpose ? "#2f7d35" : "#dedad2",
                background: customPurpose ? "#dcf1dc" : "#fff",
                color: customPurpose ? "#204f25" : "#544c40",
              }}
            >
              + নিজে লিখুন
            </button>
          </div>
          {customPurpose && (
            <input
              autoFocus
              type="text"
              placeholder="যেমন: বীজ কেনা, সার কেনা..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className={inputClass + " mt-2"}
              style={inputStyle}
            />
          )}
        </Field>
      )}

      {current === "amount" && (
        <Field label="কত টাকা খরচ হয়েছে?">
          <input
            autoFocus
            type="number"
            inputMode="numeric"
            placeholder="৳ ৩,০০০"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      )}

      {current === "paidBy" && (
        <Field label="কে টাকা দিয়েছে?">
          <PersonPicker
            people={knownUsers}
            value={notPaidYet ? "" : paidBy}
            onChange={(v) => {
              setNotPaidYet(false);
              setPaidBy(v);
            }}
          />
          <button
            type="button"
            onClick={() => setNotPaidYet(true)}
            className="mt-2 w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium active:scale-95 transition-transform"
            style={{
              borderColor: notPaidYet ? "#bd4038" : "#dedad2",
              background: notPaidYet ? "#fbdedb" : "#fff",
              color: notPaidYet ? "#7c2e2b" : "#544c40",
            }}
          >
            ⏳ এখনো দেওয়া হয়নি
          </button>
        </Field>
      )}

      {current === "paidTo" && (
        <Field label="কাকে দেওয়া হয়েছে?">
          <input
            autoFocus
            type="text"
            placeholder="যেমন: দোকান, শ্রমিক, হাট"
            value={paidTo}
            onChange={(e) => setPaidTo(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      )}

      {current === "paid" && (
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
              🔴 না (বাকি থাকবে)
            </button>
          </div>
        </Field>
      )}
    </Sheet>
  );
}
