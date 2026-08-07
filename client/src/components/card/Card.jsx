import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item, onDelete, onUpdate }) {
  return (
    <div className="card-base group">
      <Link to={`/${item.id}`} className="block relative overflow-hidden aspect-[4/3]">
        <img
          src={item.images[0] || "/default-image.jpg"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 bg-navy-900/80 backdrop-blur-sm text-white font-body text-caption font-semibold rounded-pill uppercase tracking-wide">
            {item.type === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-body font-semibold text-body text-navy-800 line-clamp-1 group-hover:text-accent-600 transition-colors">
            <Link to={`/${item.id}`}>{item.title}</Link>
          </h3>
        </div>
        <p className="flex items-center gap-1.5 text-navy-400 font-body text-body-sm">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{item.address}</span>
        </p>
        <p className="font-heading text-xl font-bold text-accent-600">
          ${item.price.toLocaleString()}
          {item.type === "rent" && <span className="text-navy-400 font-body text-body-sm font-normal">/mo</span>}
        </p>
        <div className="flex items-center gap-4 pt-2 mt-auto border-t border-surface-200">
          <div className="flex items-center gap-1.5 text-navy-500 font-body text-body-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
            </svg>
            <span>{item.bedroom} bed</span>
          </div>
          <div className="flex items-center gap-1.5 text-navy-500 font-body text-body-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            <span>{item.bathroom} bath</span>
          </div>
        </div>

        {/* Action buttons for profile page */}
        {onDelete && onUpdate && (
          <div className="flex gap-2 mt-1">
            <button
              className="btn-outline !py-1.5 !px-3 !text-caption flex-1"
              onClick={onUpdate}
            >
              Edit
            </button>
            <button
              className="inline-flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 font-body font-semibold text-caption rounded-btn border border-red-200 hover:bg-red-100 transition-colors flex-1"
              onClick={onDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
