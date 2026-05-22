export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8">
      <div className="mb-4 h-4 w-72 rounded bg-border" />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="aspect-square max-w-[400px] rounded bg-border lg:col-span-2" />
        <div className="space-y-4 lg:col-span-3">
          <div className="h-6 w-3/4 rounded bg-border" />
          <div className="h-4 w-1/2 rounded bg-border" />
          <div className="h-24 rounded bg-border" />
          <div className="h-10 w-full rounded bg-border" />
        </div>
      </div>
    </div>
  );
}
