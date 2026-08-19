export default function WindowChrome({ dark = false }: { dark?: boolean }) {
  const dot = dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)";
  return (
    <div
      className="flex items-center gap-1.5 px-3.5 py-2.5"
      style={{ background: dark ? "#000" : "#EDEDED" }}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
      <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
      <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
    </div>
  );
}
