// app/(main)/loading.tsx
// Shown while any customer-facing page is loading.

export default function MainLoading() {
  return (
    <div className="min-h-screen bg-[#faf7f2] animate-pulse">
      {/* Header placeholder */}
      <div className="w-full h-16 bg-white border-b border-[#e8e0d0]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero skeleton */}
        <div className="w-full h-[300px] sm:h-[400px] bg-[#e8e0d0] rounded-2xl mb-10" />

        {/* Cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#e8e0d0] overflow-hidden"
            >
              <div className="aspect-square bg-[#f0ece4]" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 bg-[#f0ece4] rounded-lg w-3/4" />
                <div className="h-3 bg-[#f5f0ea] rounded-lg w-1/2" />
                <div className="h-6 bg-[#f0ece4] rounded-lg w-1/3 mt-1" />
                <div className="h-9 bg-[#eef5ea] rounded-xl mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}