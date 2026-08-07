import React, { useEffect } from 'react';
import './Notification.scss';

function Notification({ message, type, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[1000] max-w-md w-[90%] sm:w-auto
                 flex items-center gap-3 px-5 py-3.5 rounded-card shadow-elevated
                 backdrop-blur-md border font-body text-body-sm transition-all duration-300 animate-slide-down
                 ${
                   isSuccess
                     ? 'bg-navy-900/95 border-accent-500/50 text-white'
                     : 'bg-red-950/95 border-red-500/50 text-white'
                 }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isSuccess ? 'bg-accent-500 text-white' : 'bg-red-500 text-white'
        }`}
      >
        {isSuccess ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      <span className="font-medium tracking-wide flex-1">{message}</span>

      <button
        onClick={onClose}
        className="text-white/60 hover:text-white transition-colors p-1 rounded-btn"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default Notification;
