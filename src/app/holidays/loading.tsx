export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-primary-900 h-28 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 h-96 bg-white rounded-2xl animate-pulse" />
          <div className="flex-1 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
