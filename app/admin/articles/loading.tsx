export default function AdminArticlesLoading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="h-9 w-32 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-11 w-36 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-28 rounded-lg bg-gray-200 animate-pulse" />
        ))}
      </div>

      {/* Articles Grid Skeleton */}
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
                <div className="space-y-1">
                  <div className="h-3 bg-gray-100 rounded w-24" />
                  <div className="h-3 bg-gray-100 rounded w-32" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="flex-1 h-9 bg-gray-100 rounded" />
                  <div className="flex-1 h-9 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
