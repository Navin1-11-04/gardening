// app/(main)/shop/loading.tsx
// Skeleton shown while the shop page is loading products.

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#faf7f2] animate-pulse">
      {/* Hero banner skeleton */}
      <div className="w-full h-[200px] sm:h-[280px] bg-[#d4c9a8]" />

      {/* Category tabs skeleton */}
      <div className="bg-white border-b-2 border-[#e8e0d0] px-4 sm:px-6 py-2">
        <div className="flex gap-2 overflow-x-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="shrink-0 h-10 w-24 bg-[#f0ece4] rounded-xl"
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar skeleton (desktop) */}
          <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
            <div className="h-5 w-20 bg-[#e8e0d0] rounded-lg" />
            <div className="bg-white rounded-2xl border border-[#e8e0d0] p-4 flex flex-col gap-3">
              <div className="h-5 w-32 bg-[#f0ece4] rounded-lg" />
              <div className="h-3 w-full bg-[#f5f0ea] rounded-lg" />
              <div className="h-2 w-full bg-[#f0ece4] rounded-full mt-2" />
            </div>
            <div className="bg-white rounded-2xl border border-[#e8e0d0] p-4 flex flex-col gap-3">
              <div className="h-5 w-28 bg-[#f0ece4] rounded-lg" />
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#f0ece4] rounded-lg" />
                  <div className="h-4 w-24 bg-[#f5f0ea] rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Product grid skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="h-5 w-32 bg-[#e8e0d0] rounded-lg" />
              <div className="h-10 w-36 bg-[#e8e0d0] rounded-xl" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="flex flex-col bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden"
                >
                  <div className="aspect-square bg-[#f0ece4]" />
                  <div className="p-3 sm:p-4 flex flex-col gap-2">
                    <div className="h-5 bg-[#f0ece4] rounded-lg w-3/4" />
                    <div className="h-3 bg-[#f5f0ea] rounded-lg w-1/2" />
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-3 h-3 bg-[#f0e8c8] rounded-sm" />
                      ))}
                    </div>
                    <div className="h-6 bg-[#eef5ea] rounded-lg w-1/3 mt-1" />
                    <div className="h-9 bg-[#eef5ea] rounded-xl mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}