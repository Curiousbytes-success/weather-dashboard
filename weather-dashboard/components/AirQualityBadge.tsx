export function getPM25Status(pm25: number) {
  if (pm25 <= 12) return { label: "Good", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
  if (pm25 <= 35.4) return { label: "Moderate", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
  if (pm25 <= 55.4) return { label: "Unhealthy for Sensitive Groups", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" };
  return { label: "Unhealthy", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" };
}
