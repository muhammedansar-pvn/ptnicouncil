import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#0756A0] flex items-center justify-center font-black text-2xl mb-4">
        404
      </div>
      <h1 className="text-3xl font-black text-slate-900">Page Not Found</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        The requested page does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0756A0] text-white font-bold text-sm shadow hover:bg-[#054380] transition-colors"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
}
