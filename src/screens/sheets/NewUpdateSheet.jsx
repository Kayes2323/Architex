import { useState } from "react";
import Sheet, { Field, PrimaryButton } from "../../components/Sheet.jsx";
import { useFarm } from "../../store/FarmStore.jsx";

export default function NewUpdateSheet({ onClose, onSaved }) {
  const { currentUser, addTodayUpdate } = useFarm();
  const [text, setText] = useState("");

  const save = () => {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" });
    addTodayUpdate({ text: text.trim(), author: currentUser, time });
    onSaved && onSaved();
    onClose();
  };

  return (
    <Sheet
      title="📢 আজকের আপডেট দিন"
      onClose={onClose}
      footer={
        <PrimaryButton onClick={save} disabled={!text.trim()}>
          আপডেট পোস্ট করুন
        </PrimaryButton>
      }
    >
      <p className="mb-3 text-xs" style={{ color: "#867a65" }}>
        {currentUser} হিসেবে পোস্ট হবে।
      </p>
      <Field label="আজ কী হয়েছে?">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="যেমন: আজ গরুর শেডের ছাদের কাজ ২০% এগিয়েছে।"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          style={{ borderColor: "#dedad2", color: "#28241f" }}
        />
      </Field>
    </Sheet>
  );
}
