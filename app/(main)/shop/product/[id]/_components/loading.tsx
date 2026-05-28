// app/(main)/shop/product/[id]/loading.tsx
// Skeleton shown while the product detail page loads.

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#faf7f2] animate-pulse">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e8e0d0] px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-[#f0ece4] rounded" />
          <div className="h-4 w-4 bg-[#f0ece4] rounded" />
          <div className="h-4 w-16 bg-[#f0ece4] rounded" />
          <div className="h-4 w-4 bg-[#f0ece4] rounded" />
          <div className="h-4 w-32 bg-[#f0ece4] rounded" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">

          {/* Left: image */}
          <div className="flex flex-col gap-3">
            <div className="aspect-square rounded-2xl bg-[#e8e0d0]" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-[#f0ece4]" />
              ))}
            </div>
          </div>

          {/* Right: info */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="h-3 w-20 bg-[#eef5ea] rounded" />
            <div className="h-8 w-3/4 bg-[#f0ece4] rounded-xl" />
            <div className="h-4 w-1/2 bg-[#f5f0ea] rounded-lg" />
            <div className="flex gap-1 mt-1">
              {[1,2,3,4,5].map((s) => (
                <div key={s} className="w-4 h-4 bg-[#f0e8c8] rounded" />
              ))}
            </div>
            <div className="h-16 bg-[#eef5ea] rounded-2xl mt-2" />
            <div className="flex gap-3 mt-2">
              {[1,2,3].map((i) => (
                <div key={i} className="h-10 w-28 bg-[#f0ece4] rounded-xl" />
              ))}
            </div>
            <div className="flex gap-3 mt-1">
              <div className="h-12 w-24 bg-[#f0ece4] rounded-xl" />
              <div className="h-12 flex-1 bg-[#eef5ea] rounded-xl" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[1,2,3].map((i) => (
                <div key={i} className="h-16 bg-[#f5f0ea] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}