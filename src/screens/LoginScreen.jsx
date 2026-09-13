import { useState } from "react";
import { useFarm } from "../store/FarmStore.jsx";

export default function LoginScreen() {
  const { login, authError } = useFarm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      /* authError already set in store */
    }
    setLoading(false);
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(180deg,#26632b 0%,#2f7d35 55%,#f2f6f1 55%)" }}
    >
      <div className="mb-8">
        <div className="text-5xl">🌱</div>
        <h1 className="mt-3 text-xl font-extrabold text-white">নাজির আহমদ এগ্রো ফার্ম</h1>
        <p className="mt-1 text-sm" style={{ color: "#dcf1dc" }}>
          পরিবারের সবার জন্য একটাই অ্যাপ
        </p>
      </div>

      <form onSubmit={submit} className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-pop">
        <div className="mb-1 text-base font-bold" style={{ color: "#28241f" }}>
          লগইন করুন
        </div>
        <p className="mb-4 text-sm" style={{ color: "#867a65" }}>
          আপনার ইমেইল ও পাসওয়ার্ড দিন
        </p>
        <input
          type="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ইমেইল"
          className="mb-2 w-full rounded-xl border px-3.5 py-3 text-base outline-none focus:border-brand-500"
          style={{ borderColor: "#dedad2", color: "#28241f" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="পাসওয়ার্ড"
          className="w-full rounded-xl border px-3.5 py-3 text-base outline-none focus:border-brand-500"
          style={{ borderColor: "#dedad2", color: "#28241f" }}
        />
        {authError && (
          <p className="mt-2 text-sm font-semibold" style={{ color: "#bd4038" }}>
            {authError}
          </p>
        )}
        <button
          type="submit"
          disabled={!email.trim() || !password || loading}
          className="mt-3 w-full rounded-xl py-3 text-sm font-bold text-white shadow-card active:scale-[0.98] transition-transform disabled:opacity-40"
          style={{ background: "#2f7d35" }}
        >
          {loading ? "..." : "লগইন করুন"}
        </button>
        <p className="mt-3 text-xs" style={{ color: "#867a65" }}>
          অ্যাকাউন্ট না থাকলে পরিবারের যিনি অ্যাপ সেটআপ করেছেন তার কাছ থেকে ইমেইল ও পাসওয়ার্ড নিন।
        </p>
      </form>
    </div>
  );
}
