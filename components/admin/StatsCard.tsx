interface StatsCardProps {
  title: string;
  value: number | string;
  hint?: string;
  accent?: string;
  icon?: string;
}

export default function StatsCard({
  title,
  value,
  hint,
  accent = "border-primary",
  icon,
}: StatsCardProps) {
  return (
    <div
      className={`rounded-lg border border-border border-l-4 bg-white p-4 shadow-sm ${accent}`}
    >
      <p className="text-xs text-grey-text">
        {icon && <span className="mr-1">{icon}</span>}
        {title}
      </p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
      {hint && <p className="mt-1 text-xs text-success">{hint}</p>}
    </div>
  );
}
