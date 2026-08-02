import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/categories', label: 'Categories' },
  { to: '/artists', label: 'Artists' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const { favorites } = useFavorites();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate('/');
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-glass-shadow' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight">
            Era <span className="text-gold-500">Nostalgia</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-gold-600 dark:text-gold-400'
                    : 'text-onyx-600 dark:text-onyx-300 hover:text-onyx-950 dark:hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="grid place-items-center h-10 w-10 rounded-full text-onyx-600 dark:text-onyx-300 hover:bg-onyx-100 dark:hover:bg-onyx-900 transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/favorites"
            className="relative grid place-items-center h-10 w-10 rounded-full text-onyx-600 dark:text-onyx-300 hover:bg-onyx-100 dark:hover:bg-onyx-900 transition-colors"
            aria-label="Favorites"
          >
            <Heart size={18} />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-[18px] px-1 rounded-full bg-gold-500 text-onyx-950 text-[10px] font-semibold grid place-items-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <div className="relative hidden sm:block">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="grid place-items-center h-10 w-10 rounded-full text-onyx-600 dark:text-onyx-300 hover:bg-onyx-100 dark:hover:bg-onyx-900 transition-colors"
              aria-label="Account menu"
            >
              <User size={18} />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-glass-shadow p-2"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {user ? (
                  <>
                    <p className="px-3 py-2 text-xs text-onyx-400 truncate">{user.email}</p>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-onyx-100 dark:hover:bg-onyx-800"
                    >
                      <User size={15} /> Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-onyx-100 dark:hover:bg-onyx-800"
                      >
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-500/10"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-sm hover:bg-onyx-100 dark:hover:bg-onyx-800"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-sm hover:bg-onyx-100 dark:hover:bg-onyx-800"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden grid place-items-center h-10 w-10 rounded-full text-onyx-600 dark:text-onyx-300"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden glass border-t border-onyx-200/50 dark:border-onyx-800/50 px-4 py-4 space-y-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400' : 'text-onyx-600 dark:text-onyx-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="h-px bg-onyx-200 dark:bg-onyx-800 my-2" />
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm">
                Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-xl text-sm text-red-500">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm">
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm">
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
