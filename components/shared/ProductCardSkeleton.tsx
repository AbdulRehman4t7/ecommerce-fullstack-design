export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded border border-border bg-white p-2">
      <div className="aspect-square w-full max-w-[120px] bg-border" />
      <div className="mt-2 h-4 w-16 rounded bg-border" />
      <div className="mt-2 h-3 w-full rounded bg-border" />
      <div className="mt-1 h-3 w-3/4 rounded bg-border" />
    </div>
  );
}
