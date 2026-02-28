import Link from "next/link";

const links = {
  Holidays: [
    { label: "Ski Holidays", href: "/holidays?type=ski" },
    { label: "Beach Holidays", href: "/holidays?type=beach" },
    { label: "City Breaks", href: "/holidays?type=city" },
    { label: "Summer Holidays", href: "/holidays?type=summer" },
    { label: "Special Offers", href: "/holidays?offer=true" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Sustainability", href: "#" },
  ],
  Support: [
    { label: "Help Centre", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Manage Booking", href: "#" },
    { label: "Travel Insurance", href: "#" },
  ],
  Legal: [
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Booking Conditions", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-bold text-xl text-white">Sunway</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Europe&apos;s leading ski & holiday specialist. Trusted by over 2 million travellers.
            </p>
            <div className="flex gap-3">
              {["facebook", "instagram", "twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
                  aria-label={social}
                >
                  <span className="text-xs font-bold text-white uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-semibold text-white text-sm mb-4">{title}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center gap-4 py-6 border-t border-slate-800 border-b mb-6">
          {[
            { label: "ATOL Protected", detail: "ATOL No. 12345" },
            { label: "ABTA Member", detail: "ABTA No. Y6827" },
            { label: "Trustpilot Excellent", detail: "4.5 / 5 · 84,000 reviews" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-white text-xs font-semibold">{item.label}</div>
                <div className="text-slate-500 text-xs">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} Sunway Holidays Ltd. All rights reserved.</p>
          <p>Part of PE Firn Group · Registered in England No. 987654</p>
        </div>
      </div>
    </footer>
  );
}
