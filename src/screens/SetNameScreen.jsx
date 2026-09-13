import { useState } from "react";
import { useFarm } from "../store/FarmStore.jsx";

export default function SetNameScreen() {
  const { setDisplayName } = useFarm();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await setDisplayName(name.trim());
    setSaving(false);
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(180deg,#26632b 0%,#2f7d35 55%,#f2f6f1 55%)" }}
    >
      <div className="mb-8">
        <div className="text-5xl">🌱</div>
        <h1 className="mt-3 text-xl font-extrabold text-white">নাজির আহমদ এগ্রো ফার্ম</h1>
      </div>

      <form onSubmit={submit} className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-pop">
        <div className="mb-1 text-base font-bold" style={{ color: "#28241f" }}>
          স্বাগতম!
        </div>
        <p className="mb-4 text-sm" style={{ color: "#867a65" }}>
          আপনার নামটি লিখুন, এটাই সবার কাছে আপনার পরিচয় হিসেবে দেখাবে।
        </p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="যেমন: রহিম উদ্দিন"
          className="w-full rounded-xl border px-3.5 py-3 text-center text-base outline-none focus:border-brand-500"
          style={{ borderColor: "#dedad2", color: "#28241f" }}
        />
        <button
          type="submit"
          disabled={!name.trim() || saving}
          className="mt-3 w-full rounded-xl py-3 text-sm font-bold text-white shadow-card active:scale-[0.98] transition-transform disabled:opacity-40"
          style={{ background: "#2f7d35" }}
        >
          {saving ? "..." : "শুরু করুন"}
        </button>
      </form>
    </div>
  );
}
