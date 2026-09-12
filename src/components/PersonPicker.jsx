import { useState } from "react";
import { inputClass, inputStyle } from "./Sheet.jsx";

// hardcoded "বাবা/চাচা" লিস্ট নেই — যারা আগে অ্যাপে নাম ব্যবহার করেছে (knownUsers)
// তাদের থেকে বেছে নেওয়া যায়, অথবা নতুন কারও নাম টাইপ করা যায়।
export default function PersonPicker({ people, value, onChange }) {
  const isCustom = !!value && !people.includes(value);
  const [customMode, setCustomMode] = useState(isCustom);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {people.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setCustomMode(false);
              onChange(name);
            }}
            className="rounded-full border px-3.5 py-2 text-sm font-medium active:scale-95 transition-transform"
            style={{
              borderColor: !customMode && value === name ? "#2f7d35" : "#dedad2",
              background: !customMode && value === name ? "#dcf1dc" : "#fff",
              color: !customMode && value === name ? "#204f25" : "#544c40",
            }}
          >
            {name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setCustomMode(true);
            onChange("");
          }}
          className="rounded-full border px-3.5 py-2 text-sm font-medium active:scale-95 transition-transform"
          style={{
            borderColor: customMode ? "#2f7d35" : "#dedad2",
            background: customMode ? "#dcf1dc" : "#fff",
            color: customMode ? "#204f25" : "#544c40",
          }}
        >
          + অন্য নাম
        </button>
      </div>
      {customMode && (
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="নাম লিখুন"
          className={inputClass + " mt-2"}
          style={inputStyle}
        />
      )}
    </div>
  );
}
