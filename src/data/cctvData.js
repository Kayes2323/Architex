// CCTV / Farm Monitoring মডিউলের জন্য নমুনা ডেটা — ভবিষ্যতে real camera/NVR backend দিয়ে replace হবে।
// এই ফাইলের data shape-টাই ভবিষ্যত backend integration-এর জন্য contract হিসেবে ব্যবহারযোগ্য।

import { toBnNumerals } from "./mockData.js";

export function seedCameras() {
  return [
    {
      id: "gate",
      name: "প্রধান গেট",
      icon: "🚪",
      location: "Main Gate",
      cameraType: "IP Camera",
      status: "online", // 'online' | 'offline'
      hasAudio: true,
      recordingEnabled: true,
      lastConnected: null,
    },
    {
      id: "cow",
      name: "গরুর শেড",
      icon: "🐄",
      location: "Cattle Shed",
      cameraType: "IP Camera",
      status: "online",
      hasAudio: false,
      recordingEnabled: true,
      lastConnected: null,
    },
    {
      id: "goat",
      name: "ছাগলের শেড",
      icon: "🐐",
      location: "Goat Shed",
      cameraType: "IP Camera",
      status: "online",
      hasAudio: false,
      recordingEnabled: true,
      lastConnected: null,
    },
    {
      id: "building",
      name: "ভবন এলাকা",
      icon: "🏠",
      location: "Building",
      cameraType: "IP Camera",
      status: "online",
      hasAudio: true,
      recordingEnabled: true,
      lastConnected: null,
    },
    {
      id: "pond",
      name: "পুকুর",
      icon: "🐟",
      location: "Pond",
      cameraType: "IP Camera",
      status: "offline",
      hasAudio: false,
      recordingEnabled: false,
      lastConnected: { h: 0, m: 42 },
    },
  ];
}

export function seedCctvAlerts() {
  return [
    {
      id: "al1",
      cameraId: "gate",
      bnTitle: "গতিবিধি শনাক্ত হয়েছে",
      type: "movement",
      severity: "critical",
      dateLabel: "আজ",
      time: { h: 2, m: 17 },
      status: "new",
    },
    {
      id: "al2",
      cameraId: "cow",
      bnTitle: "অস্বাভাবিক কার্যকলাপ",
      type: "unusual",
      severity: "warning",
      dateLabel: "আজ",
      time: { h: 3, m: 5 },
      status: "new",
    },
    {
      id: "al3",
      cameraId: "pond",
      bnTitle: "ক্যামেরার সংযোগ বিচ্ছিন্ন হয়েছে",
      type: "disconnected",
      severity: "critical",
      dateLabel: "আজ",
      time: { h: 6, m: 42 },
      status: "viewed",
    },
  ];
}

export const RECORDING_DATES = [
  { key: "today", label: "আজ" },
  { key: "d1", label: "১১ সেপ্টেম্বর" },
  { key: "d2", label: "১০ সেপ্টেম্বর" },
  { key: "d3", label: "৯ সেপ্টেম্বর" },
];

const TIMELINE_ACTIVITY_HOURS = {
  today: [2, 4, 14],
  d1: [6, 9, 20],
  d2: [1, 13],
  d3: [5, 11, 19],
};

const ACTIVITY_CAMERA_NAMES = ["প্রধান গেট", "গরুর শেড", "ছাগলের শেড", "পুকুর", "ভবন এলাকা"];

function dayPart(h) {
  if (h >= 4 && h < 12) return "সকাল";
  if (h >= 12 && h < 16) return "দুপুর";
  if (h >= 16 && h < 18) return "বিকাল";
  if (h >= 18 && h < 20) return "সন্ধ্যা";
  return "রাত";
}
function to12(h) {
  const hh = h % 12;
  return hh === 0 ? 12 : hh;
}
export function bnClock(h, m) {
  return `${dayPart(h)} ${toBnNumerals(to12(h))}:${toBnNumerals(String(m).padStart(2, "0"))}`;
}
export function bnHourLabel(h) {
  return `${dayPart(h)} ${toBnNumerals(to12(h))}:০০`;
}

export function generateTimeline(dateKey) {
  const activityHours = TIMELINE_ACTIVITY_HOURS[dateKey] || [];
  return Array.from({ length: 24 }, (_, h) => {
    const hasActivity = activityHours.includes(h);
    return {
      hour: h,
      label: bnHourLabel(h),
      hasActivity,
      cameraName: hasActivity ? ACTIVITY_CAMERA_NAMES[h % ACTIVITY_CAMERA_NAMES.length] : null,
    };
  });
}

export function cameraById(cameras, id) {
  return cameras.find((c) => c.id === id) || null;
}

export function computeCctvSummary(cameras, alerts) {
  const online = cameras.filter((c) => c.status === "online").length;
  const offline = cameras.length - online;
  const newAlerts = alerts.filter((a) => a.status === "new").length;
  return { online, offline, total: cameras.length, newAlerts };
}

export const AI_CAPABILITIES = [
  "মানুষ শনাক্ত করা",
  "গরু/ছাগল শনাক্ত করা",
  "গতিবিধি শনাক্তকরণ (Movement Detection)",
  "অস্বাভাবিক কার্যকলাপ শনাক্তকরণ",
  "গেট কার্যকলাপ শনাক্তকরণ",
  "আগুন/ধোঁয়া শনাক্তকরণ",
  "রাতের কার্যকলাপ শনাক্তকরণ",
];
