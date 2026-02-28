import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🏔️</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Holiday not found</h1>
        <p className="text-slate-500 mb-8">
          We couldn&apos;t find that holiday. It may have sold out or the link may be incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/holidays"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Browse all holidays
          </Link>
          <Link
            href="/"
            className="border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-white transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
