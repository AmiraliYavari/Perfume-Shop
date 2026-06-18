export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-200 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 skeleton" />
        <div className="h-3 bg-gray-200 rounded w-1/2 skeleton" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded w-20 skeleton" />
          <div className="h-3 bg-gray-200 rounded w-10 skeleton" />
        </div>
      </div>
    </div>
  );
}