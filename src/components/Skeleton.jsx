export function CardSkeleton() {
  return (
    <div className="break-inside-avoid mb-6">
      <div className="skeleton w-full" style={{ height: `${220 + Math.round(Math.random() * 160)}px` }} />
      <div className="skeleton h-4 w-3/4 mt-3" />
      <div className="skeleton h-3 w-1/2 mt-2" />
    </div>
  );
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
