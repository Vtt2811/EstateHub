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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-250 group-hover:scale-110 overflow-hidden">
              <img src="/logo.png" alt="EstateHub Logo" className="w-full h-full object-cover" />
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
            {currentUser?.role === "SELLER" ? (
              <Link
                to="/add"
                className={`nav-link ${isActive("/add") ? "nav-link-active" : ""}`}
              >
                Add Properties
              </Link>
            ) : (
              <Link
                to="/list"
                className={`nav-link ${isActive("/list") ? "nav-link-active" : ""}`}
              >
                Properties
              </Link>
            )}
          </div>

          {/* Right side - Auth */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className={`nav-link ${isActive("/admin") ? "nav-link-active" : ""} !text-accent-600 font-semibold`}
                  >
                    ⚙ Admin
                  </Link>
                )}
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
                <Link to="/messages" className="relative p-2.5 text-navy-500 hover:text-navy-900 transition-colors bg-surface-100 hover:bg-surface-200 rounded-full flex items-center justify-center" aria-label="Messages">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {number > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {number}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="btn-primary !py-2 !px-4">
                  Dashboard
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
            {currentUser?.role === "SELLER" ? (
              <Link
                to="/add"
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                Add Properties
              </Link>
            ) : (
              <Link
                to="/list"
                className="mobile-nav-link"
                onClick={() => setOpen(false)}
              >
                Properties
              </Link>
            )}
            <hr className="border-surface-200 my-3" />
            {currentUser ? (
              <>
                {currentUser.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="mobile-nav-link !text-accent-600 font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    ⚙ Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/messages"
                  className="mobile-nav-link flex justify-between items-center"
                  onClick={() => setOpen(false)}
                >
                  <span>Messages</span>
                  {number > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {number}
                    </span>
                  )}
                </Link>
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
