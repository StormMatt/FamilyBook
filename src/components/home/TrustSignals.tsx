export function TrustSignals() {
  const signals = [
    {
      icon: "🛡️",
      title: "ATOL Protected",
      subtitle: "Your money is safe",
    },
    {
      icon: "✈️",
      title: "ABTA Member",
      subtitle: "Peace of mind guaranteed",
    },
    {
      icon: "⭐",
      title: "4.5/5 Trustpilot",
      subtitle: "84,000+ reviews",
    },
    {
      icon: "🏔️",
      title: "35 Years Experience",
      subtitle: "Europe's ski specialists",
    },
    {
      icon: "💰",
      title: "Price Match Promise",
      subtitle: "We'll match any price",
    },
  ];

  return (
    <section className="bg-primary-900 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 lg:gap-10 flex-wrap">
          {signals.map((s) => (
            <div key={s.title} className="flex items-center gap-2 text-white/90">
              <span className="text-lg">{s.icon}</span>
              <div>
                <div className="text-xs font-semibold">{s.title}</div>
                <div className="text-xs text-white/60 hidden sm:block">{s.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
