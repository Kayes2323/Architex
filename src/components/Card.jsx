export default function Card({ children, onClick, className = "", tone = "default", style }) {
  const border = tone === "alert" ? "#f7c1bb" : tone === "brand" ? "#b9e3ba" : "#eeece8";
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      style={{ borderColor: border, ...style }}
      className={`w-full rounded-2xl border bg-white p-3.5 text-left shadow-card ${
        onClick ? "active:scale-[0.98] transition-transform" : ""
      } ${className}`}
    >
      {children}
    </Comp>
  );
}
