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
  return [
    { id: "t1", projectId: "cow", purpose: "গরু কেনা", amount: 250000, paidBy: "বাবা", paidTo: "গরুর বাজার", paid: true, date: "2026-07-02" },
    { id: "t2", projectId: "cow", purpose: "খাবার", amount: 40000, paidBy: "বাবা", paidTo: "দোকান", paid: true, date: "2026-08-10" },
    { id: "t3", projectId: "cow", purpose: "শ্রমিক", amount: 20000, paidBy: "চাচা", paidTo: "শ্রমিক", paid: true, date: "2026-08-15" },
    { id: "t4", projectId: "cow", purpose: "অন্যান্য", amount: 10000, paidBy: "বাবা", paidTo: "দোকান", paid: true, date: "2026-08-20" },
    { id: "t5", projectId: "construction", purpose: "নির্মাণসামগ্রী", amount: 120000, paidBy: "বাবা", paidTo: "মিস্ত্রি", paid: true, date: "2026-09-01" },
    { id: "t6", projectId: "goat", purpose: "ছাগল কেনা", amount: 35000, paidBy: "চাচা", paidTo: "হাট", paid: true, date: "2026-06-18" },
    { id: "t7", projectId: "goat", purpose: "খাবার", amount: 8000, paidBy: "মা", paidTo: "দোকান", paid: true, date: "2026-08-22" },
    { id: "t8", projectId: "fish", purpose: "পোনা কেনা", amount: 15000, paidBy: "ভাই", paidTo: "মৎস্য খামার", paid: true, date: "2026-07-25" },
    { id: "t9", projectId: "poultry", purpose: "মুরগি কেনা", amount: 12000, paidBy: "আমি", paidTo: "হাট", paid: true, date: "2026-08-05" },
    { id: "t10", projectId: "cow", purpose: "খাবার", amount: 3000, paidBy: "বাবা", paidTo: "দোকান", paid: true, date: "2026-09-11" },
    { id: "t11", projectId: "construction", purpose: "শ্রমিক", amount: 5000, paidBy: "বাবা", paidTo: "শ্রমিক", paid: false, date: TODAY_ISO },
    { id: "t12", projectId: "cow", purpose: "খাবার", amount: 2850, paidBy: "বাবা", paidTo: "দোকান", paid: true, date: TODAY_ISO },
  ];
}

export function seedWorks() {
  return [
    {
      id: "w1",
      title: "গরুর শেড নির্মাণ",
      icon: "🐄",
      projectId: "construction",
      status: "running",
      progress: 60,
      totalBudget: 200000,
      spent: 120000,
      responsible: "বাবা",
      deadline: "২০ সেপ্টেম্বর",
      checklist: [
        { name: "Foundation", status: "done" },
        { name: "Pillar", status: "done" },
        { name: "Roof", status: "running" },
        { name: "Drainage", status: "pending" },
      ],
    },
    {
      id: "w2",
      title: "পুকুরের চারপাশে বেড়া দেওয়া",
      icon: "🐟",
      projectId: "fish",
      status: "running",
      progress: 30,
      totalBudget: 25000,
      spent: 8000,
      responsible: "ভাই",
      deadline: "৫ অক্টোবর",
      checklist: [
        { name: "খুঁটি বসানো", status: "done" },
        { name: "নেট কেনা", status: "running" },
        { name: "নেট লাগানো", status: "pending" },
      ],
    },
    {
      id: "w3",
      title: "ছাগলের ঘরে নতুন চাল দেওয়া",
      icon: "🐐",
      projectId: "goat",
      status: "problem",
      progress: 45,
      totalBudget: 18000,
      spent: 9500,
      responsible: "চাচা",
      deadline: "১৫ সেপ্টেম্বর",
      checklist: [
        { name: "পুরনো চাল খোলা", status: "done" },
        { name: "নতুন টিন কেনা", status: "problem" },
        { name: "নতুন চাল লাগানো", status: "pending" },
      ],
    },
    {
      id: "w4",
      title: "মুরগির খামার পরিষ্কার",
      icon: "🐔",
      projectId: "poultry",
      status: "done",
      progress: 100,
      totalBudget: 3000,
      spent: 2800,
      responsible: "আমি",
      deadline: "৮ সেপ্টেম্বর",
      checklist: [
        { name: "খামার খালি করা", status: "done" },
        { name: "ধোয়ামোছা", status: "done" },
        { name: "জীবাণুনাশক স্প্রে", status: "done" },
      ],
    },
    {
      id: "w5",
      title: "বাগানে নতুন ফলের চারা রোপণ",
      icon: "🌳",
      projectId: "garden",
      status: "pending",
      progress: 0,
      totalBudget: 6000,
      spent: 0,
      responsible: "মা",
      deadline: "১ অক্টোবর",
      checklist: [
        { name: "চারা কেনা", status: "pending" },
        { name: "গর্ত খোঁড়া", status: "pending" },
        { name: "রোপণ", status: "pending" },
      ],
    },
    {
      id: "w6",
      title: "গোয়ালঘরের বিদ্যুৎ সংযোগ",
      icon: "🐄",
      projectId: "construction",
      status: "running",
      progress: 20,
      totalBudget: 15000,
      spent: 3000,
      responsible: "ভাই",
      deadline: "২৫ সেপ্টেম্বর",
      checklist: [
        { name: "মিটার আবেদন", status: "done" },
        { name: "তার টানা", status: "running" },
        { name: "লাইট-ফ্যান লাগানো", status: "pending" },
      ],
    },
    {
      id: "w7",
      title: "গরুর ঘাস কাটা ও পরিষ্কার",
      icon: "🐄",
      projectId: "cow",
      status: "done",
      progress: 100,
      totalBudget: 1500,
      spent: 1500,
      responsible: "আমি",
      deadline: "১১ সেপ্টেম্বর",
      checklist: [
        { name: "ঘাস কাটা", status: "done" },
        { name: "গোয়ালঘর পরিষ্কার", status: "done" },
      ],
    },
  ];
}

export function seedPlans() {
  return [
    {
      id: "p1",
      author: "বাবা",
      createdAt: "2026-09-10T10:00:00Z",
      text: "আগামী মাসে আরও ৫টি গরু কেনা যেতে পারে।",
      comments: [
        { id: "c1", author: "চাচা", text: "আগে শেডটা সম্পূর্ণ করা দরকার।", createdAt: "2026-09-10T11:05:00Z" },
        { id: "c2", author: "আমি", text: "ঠিক আছে, শেড শেষ হলে গরু কেনার পরিকল্পনা করা যাবে।", createdAt: "2026-09-10T11:20:00Z" },
      ],
      convertedToWorkId: null,
    },
    {
      id: "p2",
      author: "চাচা",
      createdAt: "2026-09-05T09:00:00Z",
      text: "পুকুরে নতুন করে মাছের পোনা ছাড়া দরকার, পানি পরীক্ষা করে।",
      comments: [
        { id: "c3", author: "ভাই", text: "পানি পরীক্ষা এই সপ্তাহে করে ফেলব।", createdAt: "2026-09-05T12:00:00Z" },
      ],
      convertedToWorkId: null,
    },
    {
      id: "p3",
      author: "মা",
      createdAt: "2026-08-28T08:30:00Z",
      text: "বাগানে কিছু ফলের গাছ লাগানো দরকার — আম, লেবু, পেয়ারা।",
      comments: [],
      convertedToWorkId: "w5",
    },
  ];
}

export function seedTodayUpdates() {
  return [
    { id: "u1", text: "আজ গরুর শেডের ছাদের কাজ ২০% এগিয়েছে।", time: "সকাল ১০:৩০", author: "বাবা" },
    { id: "u2", text: "আজ ৳৩,০০০ টাকার গরুর খাবার কেনা হয়েছে।", time: "দুপুর ১২:১৫", author: "বাবা" },
    { id: "u3", text: "আজ পুকুরের পানি পরীক্ষা করা হয়েছে।", time: "বিকাল ৪:০০", author: "ভাই" },
    { id: "u4", text: "ছাগলের ঘরের টিন কিনতে সমস্যা হচ্ছে — বাজারে পাওয়া যাচ্ছে না।", time: "বিকাল ৫:২০", author: "চাচা" },
  ];
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
