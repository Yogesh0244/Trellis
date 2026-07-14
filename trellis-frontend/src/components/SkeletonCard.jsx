export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line skeleton-line--body" />
      <div className="skeleton-line skeleton-line--body short" />
    </div>
  );
}