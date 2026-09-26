import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-stone-800 hover:text-indigo-600 transition-colors">
              <span className="text-2xl">📝</span>
              <span className="hidden sm:inline">مدونتي</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/" active={location.pathname === '/'}>
                <i className="fas fa-home ml-2"></i>
                الرئيسية
              </NavLink>
              <NavLink to="/dashboard" active={isDashboard}>
                <i className="fas fa-cog ml-2"></i>
                لوحة التحكم
              </NavLink>
              <Link
                to="/dashboard/new"
                className="mr-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <i className="fas fa-plus ml-1"></i>
                مقال جديد
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-stone-100 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-stone-700 hover:bg-stone-50"
              >
                <i className="fas fa-home ml-2"></i>
                الرئيسية
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-stone-700 hover:bg-stone-50"
              >
                <i className="fas fa-cog ml-2"></i>
                لوحة التحكم
              </Link>
              <Link
                to="/dashboard/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 mt-1 bg-indigo-600 text-white rounded-lg text-center"
              >
                <i className="fas fa-plus ml-1"></i>
                مقال جديد
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-stone-500 text-sm">
          <p>مدونتي الشخصية © {new Date().getFullYear()} — جميع الذكريات محفوظة ❤️</p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
      }`}
    >
      {children}
    </Link>
  );
}
