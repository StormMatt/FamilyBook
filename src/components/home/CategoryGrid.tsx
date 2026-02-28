import Link from "next/link";

const categories = [
  {
    type: "ski",
    label: "Ski Holidays",
    emoji: "⛷️",
    description: "Lift passes included in every ski package",
    count: "220+ resorts",
    gradient: "from-blue-600 to-blue-800",
    href: "/holidays?type=ski",
  },
  {
    type: "beach",
    label: "Beach Holidays",
    emoji: "🏖️",
    description: "Sun, sea and sand across Europe",
    count: "50+ destinations",
    gradient: "from-cyan-500 to-blue-600",
    href: "/holidays?type=beach",
  },
  {
    type: "city",
    label: "City Breaks",
    emoji: "🏙️",
    description: "Explore Europe's most vibrant cities",
    count: "30+ cities",
    gradient: "from-purple-600 to-indigo-700",
    href: "/holidays?type=city",
  },
  {
    type: "summer",
    label: "Summer Holidays",
    emoji: "☀️",
    description: "Warm evenings and great food",
    count: "40+ destinations",
    gradient: "from-orange-500 to-amber-600",
    href: "/holidays?type=summer",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          What kind of holiday?
        </h2>
        <p className="text-slate-500 text-lg">
          From powder snow to sandy beaches, we&apos;ve got your perfect getaway.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.type}
            href={cat.href}
            className={`group relative bg-gradient-to-br ${cat.gradient} rounded-2xl p-6 text-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-44`}
          >
            {/* Background shine */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10" />

            <div className="relative">
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="font-bold text-lg leading-tight mb-1">{cat.label}</h3>
              <p className="text-white/75 text-sm mb-3 hidden sm:block">{cat.description}</p>
              <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold">
                {cat.count}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
