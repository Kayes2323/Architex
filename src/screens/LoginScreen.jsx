import { useState } from "react";
import { useFarm } from "../store/FarmStore.jsx";

export default function LoginScreen() {
  const { loginWithGoogle, authError } = useFarm();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
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

      <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-pop">
        <div className="mb-1 text-base font-bold" style={{ color: "#28241f" }}>
          স্বাগতম!
        </div>
        <p className="mb-5 text-sm" style={{ color: "#867a65" }}>
          আপনার Google অ্যাকাউন্ট দিয়ে লগইন করুন — কোনো পাসওয়ার্ড লাগবে না।
        </p>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border py-3 text-sm font-bold shadow-card active:scale-[0.98] transition-transform disabled:opacity-50"
          style={{ borderColor: "#dedad2", color: "#28241f" }}
        >
          <GoogleIcon />
          {loading ? "..." : "Google দিয়ে লগইন করুন"}
        </button>
        {authError && (
          <p className="mt-3 text-sm font-semibold" style={{ color: "#bd4038" }}>
            {authError}
          </p>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35.1 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.3 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.9 36.5 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}
