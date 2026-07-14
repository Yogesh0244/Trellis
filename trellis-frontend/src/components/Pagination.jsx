export default function Pagination({ pageData, onPageChange }) {
  if (!pageData || pageData.totalElements === 0) return null;

  const { number, totalPages, totalElements, first, last, size } = pageData;

  const startItem = number * size + 1;
  const endItem = Math.min((number + 1) * size, totalElements);

  return (
    <div className="pagination">
      <span className="pagination__summary">
        Showing {startItem}–{endItem} of {totalElements}
      </span>
      <div className="pagination__controls">
        <button className="btn btn--ghost btn--sm" disabled={first} onClick={() => onPageChange(number - 1)}>
          ← Previous
        </button>
        <span className="pagination__page">
          Page {number + 1} of {totalPages}
        </span>
        <button className="btn btn--ghost btn--sm" disabled={last} onClick={() => onPageChange(number + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}