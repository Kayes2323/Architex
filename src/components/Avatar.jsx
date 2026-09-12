const PALETTE = ["#2f7d35", "#bd4038", "#f0900b", "#3f9944", "#6b6151", "#26632b"];

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % PALETTE.length;
  return PALETTE[hash];
}

export default function Avatar({ name, size = 32 }) {
  const bg = colorFor(name || "?");
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.42 }}
    >
      {(name || "?").slice(0, 1)}
    </span>
  );
}
