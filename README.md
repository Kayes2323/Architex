# নাজির আহমদ এগ্রো ফার্ম

"নাজির আহমদ এগ্রো ফার্ম"-এর জন্য একটি সম্পূর্ণ Farm Management App-এর **UI/UX clickable prototype**। React + Tailwind দিয়ে তৈরি, mobile-first, Green + Light Red থিমে।

এই প্রোটোটাইপে backend/database নেই — সব ডেটা browser-এর `localStorage`-এ থাকে (রিফ্রেশ করলেও থেকে যায়, কিন্তু আসল database নয়)।

## স্ক্রিন

- 🏠 **হোম** — আজকের আপডেট, চলমান কাজের কার্ড, দ্রুত অ্যাকশন
- 💰 **হিসাব** — সব প্রজেক্টের সম্মিলিত হিসাব + প্রজেক্ট-ভিত্তিক বিস্তারিত হিসাব + নতুন হিসাব ফর্ম
- 🛠️ **কাজ** — স্ট্যাটাস অনুযায়ী কাজের তালিকা + কাজের বিস্তারিত (checklist, progress, বাজেট)
- 📋 **পরিকল্পনা** — পরিবারের আইডিয়া/আলোচনা ফিড (post + comment), নতুন পরিকল্পনা, পরিকল্পনা → কাজ রূপান্তর, এবং **Farm 3D Model**

## Farm 3D Model

আগের deployed 3D Farm Designer (`src/farm3d/FarmDesigner.jsx`) হুবহু অপরিবর্তিত রাখা হয়েছে — সব object, drag/drop, tour, save/load, JSON export/import আগের মতোই কাজ করে। এটি এখন "পরিকল্পনা" ট্যাবের ভিতরে "🗺️ Farm 3D Model" হিসেবে নতুন app-এর সাথে integrate করা হয়েছে।

## প্রজেক্ট স্ট্রাকচার

```
src/
  App.jsx                 — bottom nav + screen router
  store/FarmStore.jsx     — shared app state (localStorage backed)
  data/mockData.js        — নমুনা ডেটা ও helper functions
  components/             — reusable UI (BottomNav, Card, ProgressBar, StatusBadge, Sheet, ...)
  screens/                — মূল স্ক্রিনগুলো
  screens/sheets/         — ফর্ম/মোডাল (নতুন হিসাব, নতুন পরিকল্পনা, নতুন আপডেট, ...)
  farm3d/FarmDesigner.jsx — অপরিবর্তিত বিদ্যমান 3D মডেল
```

## লোকালি চালানো

```bash
npm install
npm run dev
```

তারপর ব্রাউজারে `http://localhost:5173` খুলুন।

## Vercel-এ Deploy করা (৩টা ধাপ)

### ধাপ ১ — GitHub-এ push করুন
```bash
git add .
git commit -m "Update"
git push
```

### ধাপ ২ — Vercel-এ import করুন
1. [vercel.com](https://vercel.com)-এ যান, GitHub দিয়ে লগইন করুন।
2. "Add New Project" → এই repo সিলেক্ট করুন।
3. Framework Preset: **Vite** (Vercel নিজে থেকেই ধরে ফেলবে)।
4. Build Command: `npm run build`, Output Directory: `dist` (ডিফল্ট)।
5. "Deploy" চাপুন।

### ধাপ ৩ — লাইভ লিংক
২-৩ মিনিটে একটা লাইভ URL পাবেন।

## সীমাবদ্ধতা (সততার সাথে)

- এটি একটি **UI/UX prototype** — backend, database বা authentication নেই।
- সব ডেটা browser `localStorage`-এ থাকে; ব্রাউজার/ডিভাইস পাল্টালে আগের ডেটা দেখা যাবে না।
- 3D মডেল একটি massing/concept visualization tool — architectural blueprint না।
- CCTV module এখনো implement করা হয়নি (future structure হিসেবে রাখা হয়েছে)।
