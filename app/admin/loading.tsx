// app/admin/loading.tsx
// Shown while any admin page is loading (Next.js Suspense boundary).

export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-7xl animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-40 bg-[#dce8d4] rounded-xl" />
          <div className="h-4 w-24 bg-[#e8f0e4] rounded-lg" />
        </div>
        <div className="h-9 w-28 bg-[#dce8d4] rounded-xl" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#dce8d4] p-5 flex flex-col gap-3"
          >
            <div className="w-10 h-10 bg-[#e8f0e4] rounded-xl" />
            <div className="h-7 w-20 bg-[#e8f0e4] rounded-lg" />
            <div className="h-4 w-28 bg-[#f0f4ed] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl border border-[#dce8d4] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f4ed] bg-[#f8faf6]">
          <div className="h-5 w-32 bg-[#e8f0e4] rounded-lg" />
        </div>
        <div className="divide-y divide-[#f0f4ed]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 bg-[#f0f4ed] rounded-lg shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-48 bg-[#f0f4ed] rounded-lg" />
                <div className="h-3 w-24 bg-[#f5f8f2] rounded-lg" />
              </div>
              <div className="h-6 w-20 bg-[#f0f4ed] rounded-full" />
              <div className="h-4 w-16 bg-[#f0f4ed] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}