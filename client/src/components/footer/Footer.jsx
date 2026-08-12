import React from "react";
import { Link } from "react-router-dom";
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from "../properties/data";

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-white">
      {/* CTA Band */}
      <div className="bg-accent-500">
        <div className="section-container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-2xl md:text-heading font-bold text-white">
              Ready to find your dream home?
            </h3>
            <p className="text-white/80 font-body mt-1">
              Let us help you discover the perfect property.
            </p>
          </div>
          <Link to="/list" className="btn-secondary !bg-white !text-navy-900 hover:!bg-surface-100 whitespace-nowrap">
            Explore Properties
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="EstateHub Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                Estate<span className="text-accent-400">Hub</span>
              </span>
            </Link>
            <p className="text-navy-300 font-body text-body-sm leading-relaxed mb-6 max-w-sm">
              Trust EstateHub to guide you through your real estate journey. We connect you with exceptional properties and experienced professionals.
            </p>
            <div className="flex items-center gap-1">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 bg-navy-800 border border-navy-700 rounded-l-btn text-white placeholder-navy-400 text-body-sm font-body
                           focus:outline-none focus:border-accent-500 transition-colors"
              />
              <button className="px-5 py-2.5 bg-accent-500 text-white font-body font-semibold text-body-sm rounded-r-btn
                                hover:bg-accent-600 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((column, index) => (
            <div key={index} className="lg:col-span-2">
              <h4 className="font-body font-semibold text-body-sm text-white uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to="/"
                      className="text-navy-300 font-body text-body-sm hover:text-accent-400 transition-colors duration-250"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div className="lg:col-span-4">
            <h4 className="font-body font-semibold text-body-sm text-white uppercase tracking-wider mb-4">
              {FOOTER_CONTACT_INFO.title}
            </h4>
            {FOOTER_CONTACT_INFO.links.map((link, index) => (
              <p key={index} className="text-navy-300 font-body text-body-sm mb-3">
                <span className="text-navy-100 font-medium">{link.label}:</span>{" "}
                {link.value}
              </p>
            ))}
            <div className="flex items-center gap-3 mt-5">
              {SOCIALS.links.map((link, index) => (
                <Link
                  key={index}
                  to="/"
                  className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center text-navy-300
                             hover:bg-accent-500 hover:text-white transition-all duration-250"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-navy-400 font-body text-caption">
              &copy; {new Date().getFullYear()} EstateHub. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-navy-400 font-body text-caption hover:text-navy-200 transition-colors">Privacy</Link>
              <Link to="/" className="text-navy-400 font-body text-caption hover:text-navy-200 transition-colors">Terms</Link>
              <Link to="/" className="text-navy-400 font-body text-caption hover:text-navy-200 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;