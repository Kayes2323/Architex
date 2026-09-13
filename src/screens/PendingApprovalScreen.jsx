import { useFarm } from "../store/FarmStore.jsx";

export default function PendingApprovalScreen() {
  const { firebaseUser, myProfile, logout } = useFarm();
  const rejected = myProfile && myProfile.status === "rejected";

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(180deg,#26632b 0%,#2f7d35 55%,#f2f6f1 55%)" }}
    >
      <div className="mb-8">
        <div className="text-5xl">🌱</div>
        <h1 className="mt-3 text-xl font-extrabold text-white">নাজির আহমদ এগ্রো ফার্ম</h1>
      </div>

      <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-pop">
        <div className="mb-2 text-4xl">{rejected ? "🚫" : "🕐"}</div>
        <div className="mb-1 text-base font-bold" style={{ color: "#28241f" }}>
          {rejected ? "অ্যাক্সেস দেওয়া হয়নি" : "অনুমোদনের অপেক্ষায়"}
        </div>
        <p className="mb-4 text-sm" style={{ color: "#867a65" }}>
          {rejected
            ? "এই অ্যাকাউন্টটির জন্য অ্যাডমিন অনুমতি দেননি।"
            : "অনুগ্রহ করে অপেক্ষা করুন — অ্যাডমিন পর্যালোচনা করে আপনাকে অনুমোদন দেবেন।"}
        </p>
        {firebaseUser && (
          <p className="mb-4 rounded-xl px-3 py-2 text-xs" style={{ background: "#f7f7f6", color: "#544c40" }}>
            {firebaseUser.displayName} · {firebaseUser.email}
          </p>
        )}
        <button
          onClick={logout}
          className="w-full rounded-xl border py-2.5 text-sm font-bold active:scale-[0.98] transition-transform"
          style={{ borderColor: "#dedad2", color: "#544c40" }}
        >
          🚪 লগ আউট
        </button>
      </div>
    </div>
  );
}
