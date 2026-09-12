import { useState } from "react";
import Sheet, { Field, PrimaryButton } from "../../components/Sheet.jsx";
import { useFarm } from "../../store/FarmStore.jsx";

export default function NewPlanSheet({ onClose, onSaved }) {
  const { currentUser, addPlan } = useFarm();
  const [text, setText] = useState("");

  const save = () => {
    if (!text.trim()) return;
    addPlan({ author: currentUser, text: text.trim(), createdAt: new Date().toISOString() });
    onSaved && onSaved();
    onClose();
  };

  return (
    <Sheet
      title="💡 নতুন পরিকল্পনা"
      onClose={onClose}
      footer={
        <PrimaryButton onClick={save} disabled={!text.trim()}>
          পরিকল্পনা দিন
        </PrimaryButton>
      }
    >
      <p className="mb-3 text-xs" style={{ color: "#867a65" }}>
        {currentUser} হিসেবে পোস্ট হবে — পরিবারের সবাই এটা দেখতে ও মন্তব্য করতে পারবে।
      </p>
      <Field label="আপনার পরিকল্পনা বা আইডিয়া কী?">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="যেমন: আগামী মাসে আরও ৫টি গরু কেনা যেতে পারে।"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          style={{ borderColor: "#dedad2", color: "#28241f" }}
        />
      </Field>
    </Sheet>
  );
}
