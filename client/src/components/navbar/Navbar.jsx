import { useContext, useState } from "react";
import "./navbar.scss";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  const location = useLocation();

  if (currentUser) fetch();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-nav">
      <div className="section-container">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center transition-transform duration-250 group-hover:scale-110">
              <span className="text-white font-heading font-bold text-lg leading-none">E</span>
            </div>
            <span className="font-heading font-bold text-xl text-navy-900 tracking-tight">
              Estate<span className="text-accent-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/list"
              className={`nav-link ${isActive("/list") ? "nav-link-active" : ""}`}
            >
              Properties
            </Link>
          </div>

          {/* Right side - Auth */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2.5 group">
                  <img
                    src={currentUser.avatar || "/noavatar.jpg"}
                    alt={currentUser.username}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-surface-200 transition-all duration-250 group-hover:ring-accent-400"
                  />
                  <span className="font-body font-medium text-body-sm text-navy-700 group-hover:text-navy-900 transition-colors">
                    {currentUser.username}
                  </span>
                </Link>
                <Link to="/profile" className="btn-primary !py-2 !px-4 relative">
                  Dashboard
                  {number > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {number}
                    </span>
                  )}
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary !py-2.5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-btn hover:bg-surface-100 transition-colors"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-navy-800 rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-navy-800 rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-navy-800 rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 top-[72px] z-40 transition-all duration-300 ${open ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-navy-950/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        {/* Panel */}
        <div className={`absolute top-0 right-0 w-72 h-full bg-white shadow-elevated transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col p-6 gap-2">
            <Link
              to="/"
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/list"
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              Properties
            </Link>
            <hr className="border-surface-200 my-3" />
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="mobile-nav-link"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-nav-link"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary w-full mt-2"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
