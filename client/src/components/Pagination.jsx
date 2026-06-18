export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <div className="flex justify-center gap-2 mt-8">
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md text-sm ${page === currentPage ? 'bg-primary text-white' : 'bg-white border hover:bg-gray-100'}`}
        >
          {page.toLocaleString('fa-IR')}
        </button>
      ))}
    </div>
  );
}