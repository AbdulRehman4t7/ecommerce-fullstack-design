export default function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="rounded border border-border bg-white">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse gap-4 border-b border-border p-4 last:border-b-0"
        >
          <div className="h-5 w-5 shrink-0 rounded bg-border" />
          <div className="h-40 w-40 shrink-0 rounded bg-border" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-border" />
            <div className="h-3 w-1/3 rounded bg-border" />
            <div className="h-3 w-full rounded bg-border" />
            <div className="h-3 w-2/3 rounded bg-border" />
          </div>
          <div className="hidden w-[150px] space-y-2 sm:block">
            <div className="h-6 w-20 rounded bg-border" />
            <div className="h-8 w-full rounded bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}
