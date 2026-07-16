# Farm 3D Designer

নিজের জমির লেআউট ৩ডি-তে ডিজাইন করার জন্য একটা ছোট React + Three.js অ্যাপ। Drag & drop করে বিল্ডিং/শেড/রাস্তা/গাছ বসানো যায়, সাইজ-রং-পজিশন বদলানো যায়।

## লোকালি চালানো (টেস্ট করার জন্য)

```bash
npm install
npm run dev
```

তারপর ব্রাউজারে `http://localhost:5173` খুলুন।

## Vercel-এ Deploy করা (৩টা ধাপ)

### ধাপ ১ — GitHub-এ push করুন
1. [github.com](https://github.com)-এ একটা নতুন empty repository বানান (যেমন `farm-3d-designer`)।
2. এই ফোল্ডারের ভেতরে টার্মিনাল খুলে চালান:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<আপনার-ইউজারনেম>/farm-3d-designer.git
git push -u origin main
```

### ধাপ ২ — Vercel-এ import করুন
1. [vercel.com](https://vercel.com)-এ যান, GitHub দিয়ে লগইন করুন।
2. "Add New Project" → আপনার `farm-3d-designer` repo সিলেক্ট করুন।
3. Framework Preset: **Vite** (Vercel নিজে থেকেই ধরে ফেলবে)।
4. Build Command: `npm run build` (ডিফল্ট, বদলানোর দরকার নেই)।
5. Output Directory: `dist` (ডিফল্ট)।
6. "Deploy" চাপুন।

### ধাপ ৩ — লাইভ লিংক
২-৩ মিনিটে একটা লাইভ URL (যেমন `farm-3d-designer.vercel.app`) পাবেন — এটা যেকোনো জায়গা থেকে খোলা যাবে।

## কাস্টমাইজেশন
- `src/App.jsx` ফাইলে সব ডিজাইন লজিক আছে — এখানেই object presets, রং, ডিফল্ট লেআউট বদলাতে পারবেন।
- নতুন প্রিসেট (নতুন ধরনের স্ট্রাকচার) যোগ করতে `PRESETS` অবজেক্টে একটা নতুন এন্ট্রি যোগ করুন।

## সীমাবদ্ধতা (সততার সাথে)
- এটা massing/concept visualization tool — architectural blueprint বা construction-grade drawing না।
- ডেটা সেভ হয় না (browser রিফ্রেশ করলে ডিজাইন মুছে যাবে) — persistence দরকার হলে backend/database যোগ করতে হবে (যেমন Vercel KV বা Supabase)।
