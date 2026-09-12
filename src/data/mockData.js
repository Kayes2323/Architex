// প্রোটোটাইপের জন্য নমুনা ডেটা — পরবর্তীতে backend/database দিয়ে replace হবে।

export const STATUS = {
  running: { key: "running", label: "চলছে", dot: "🟢", classes: "bg-brand-50 text-brand-700 border-brand-200" },
  pending: { key: "pending", label: "অপেক্ষমাণ", dot: "🟡", classes: "bg-warn-50 text-warn-500 border-warn-200" },
  done: { key: "done", label: "শেষ", dot: "✅", classes: "bg-brand-100 text-brand-800 border-brand-300" },
  problem: { key: "problem", label: "সমস্যা", dot: "🔴", classes: "bg-alert-50 text-alert-700 border-alert-200" },
};

export const PROJECT_TYPES = [
  { id: "cow", name: "গরুর প্রজেক্ট", icon: "🐄" },
  { id: "goat", name: "ছাগলের প্রজেক্ট", icon: "🐐" },
  { id: "fish", name: "মাছের প্রজেক্ট", icon: "🐟" },
  { id: "poultry", name: "মুরগির প্রজেক্ট", icon: "🐔" },
  { id: "construction", name: "নির্মাণ", icon: "🏗️" },
  { id: "garden", name: "বাগান", icon: "🌳" },
  { id: "other", name: "অন্যান্য", icon: "📦" },
];

export const EXPENSE_PURPOSES = ["খাবার", "শ্রমিক", "কেনা", "চিকিৎসা", "নির্মাণসামগ্রী", "পরিবহন", "বিদ্যুৎ/পানি", "অন্যান্য"];

// কোন purpose আসলে সম্পদ কেনা (বিনিয়োগ) আর কোনটা চলতি খরচ — এভাবে ভাগ করা হয়।
const INVESTMENT_PURPOSES = ["কেনা", "গরু কেনা", "ছাগল কেনা", "পোনা কেনা", "মুরগি কেনা", "নির্মাণসামগ্রী", "জমি"];
export function purposeKind(purpose) {
  return INVESTMENT_PURPOSES.includes(purpose) ? "investment" : "expense";
}

// প্রোটোটাইপে "আজ" হিসেবে এই তারিখটা ব্যবহার হবে, যাতে ডেমো ডেটা সবসময় অর্থবহ থাকে।
export const TODAY_ISO = "2026-09-12";

export function seedTransactions() {
  return [];
}

export function seedWorks() {
  return [];
}

export function seedPlans() {
  return [];
}

export function seedTodayUpdates() {
  return [];
}

const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export function toBnNumerals(input) {
  return String(input).replace(/[0-9]/g, (d) => bnDigits[d]);
}

export function formatTaka(amount) {
  const n = Math.round(Number(amount) || 0);
  const neg = n < 0;
  const s = String(Math.abs(n));
  let formatted;
  if (s.length <= 3) {
    formatted = s;
  } else {
    const lastThree = s.slice(-3);
    const other = s.slice(0, -3);
    const otherGrouped = other.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    formatted = `${otherGrouped},${lastThree}`;
  }
  return (neg ? "-৳" : "৳") + toBnNumerals(formatted);
}

export function bnDate(dateLike) {
  const d = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  const day = toBnNumerals(d.getDate());
  const month = months[d.getMonth()];
  const year = toBnNumerals(d.getFullYear());
  return `${day} ${month}, ${year}`;
}

export function relativeBnTime(iso) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${toBnNumerals(mins)} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${toBnNumerals(hrs)} ঘণ্টা আগে`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${toBnNumerals(days)} দিন আগে`;
  return bnDate(iso);
}

export function computeTodaySummary(transactions, works) {
  const expenseToday = transactions
    .filter((t) => t.date === TODAY_ISO)
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const running = works.filter((w) => w.status === "running").length;
  const doneToday = works.filter((w) => w.status === "done").length;
  const problems = works.filter((w) => w.status === "problem").length;
  return { expenseToday, running, doneToday, problems };
}

export function computeFinancialSummary(transactions) {
  let totalInvestment = 0;
  let totalExpense = 0;
  let totalDue = 0;
  transactions.forEach((t) => {
    const amt = Number(t.amount || 0);
    if (purposeKind(t.purpose) === "investment") totalInvestment += amt;
    else totalExpense += amt;
    if (!t.paid) totalDue += amt;
  });
  return { totalInvestment, totalExpense, totalDue, totalIncome: 0 };
}

export function projectTransactions(transactions, projectId) {
  return transactions.filter((t) => t.projectId === projectId);
}

export function projectTotal(transactions, projectId) {
  return projectTransactions(transactions, projectId).reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

export function projectById(id) {
  return PROJECT_TYPES.find((p) => p.id === id) || PROJECT_TYPES[PROJECT_TYPES.length - 1];
}

// কোনো hardcoded "বাবা/চাচা" লিস্ট নেই — যারা লগ ইন করেছে বা যাদের নাম কোথাও
// ব্যবহার হয়েছে (হিসাব, কাজ, পরিকল্পনা), তাদের নাম থেকেই এই লিস্ট তৈরি হয়।
export function collectKnownUsers({ currentUser, transactions = [], works = [], plans = [], todayUpdates = [] }) {
  const names = [];
  const add = (n) => {
    const trimmed = (n || "").trim();
    if (trimmed && !names.includes(trimmed)) names.push(trimmed);
  };
  add(currentUser);
  transactions.forEach((t) => add(t.paidBy));
  works.forEach((w) => add(w.responsible));
  plans.forEach((p) => {
    add(p.author);
    (p.comments || []).forEach((c) => add(c.author));
  });
  todayUpdates.forEach((u) => add(u.author));
  return names;
}
