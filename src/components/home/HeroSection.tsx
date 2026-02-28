import { SearchBar } from "./SearchBar";

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/20 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full -translate-x-1/2 translate-y-1/2" />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="text-accent-400 text-sm font-semibold">✦ World&apos;s Best Ski Tour Operator</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            Your perfect
            <span className="block text-accent-400">holiday awaits</span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
            Ski, beach, city or summer — discover 220+ resorts across Europe with lift passes always included.
          </p>

          {/* Search */}
          <SearchBar />

          {/* Quick links */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { label: "⛷️ Ski", href: "/holidays?type=ski" },
              { label: "🏖️ Beach", href: "/holidays?type=beach" },
              { label: "🏙️ City Breaks", href: "/holidays?type=city" },
              { label: "🔥 Special Offers", href: "/holidays?offer=true" },
            ].map((q) => (
              <a
                key={q.href}
                href={q.href}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                {q.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
