import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCompareStore } from "../../lib/compareStore";
import apiRequest from "../../lib/apiRequest";
import "./comparePage.scss";

const ROWS = [
  { key: "image", label: "Photo" },
  { key: "title", label: "Title" },
  { key: "price", label: "Price" },
  { key: "city", label: "City" },
  { key: "type", label: "Type" },
  { key: "property", label: "Property" },
  { key: "bedroom", label: "Bedrooms" },
  { key: "bathroom", label: "Bathrooms" },
  { key: "size", label: "Size (sqft)" },
  { key: "utilities", label: "Utilities" },
  { key: "pet", label: "Pet Policy" },
  { key: "income", label: "Income Req." },
  { key: "school", label: "School (m)" },
  { key: "bus", label: "Bus Stop (m)" },
  { key: "restaurant", label: "Restaurant (m)" },
];

function cellValue(post, key) {
  if (!post) return "—";
  switch (key) {
    case "image":
      return (
        <Link to={`/${post.id}`}>
          <img
            src={post.images?.[0] || "/default-image.jpg"}
            alt={post.title}
            className="compare-page__cell-img"
          />
        </Link>
      );
    case "title":
      return (
        <Link to={`/${post.id}`} className="compare-page__cell-link">
          {post.title}
        </Link>
      );
    case "price":
      return (
        <div className="compare-page__cell-content font-heading font-bold text-accent-600">
          ₹{post.price?.toLocaleString('en-IN')}
          {post.type === "rent" && <span className="compare-page__price-sub">/mo</span>}
        </div>
      );
    case "type":
      return post.type === "rent" ? "For Rent" : "For Sale";
    case "property":
      return post.property
        ? post.property.charAt(0).toUpperCase() + post.property.slice(1)
        : "—";
    case "utilities":
      return post.postDetail?.utilities === "owner"
        ? "Owner Pays"
        : post.postDetail?.utilities === "tenant"
        ? "Tenant Pays"
        : post.postDetail?.utilities === "shared"
        ? "Shared"
        : "—";
    case "pet":
      return post.postDetail?.pet === "allowed" ? "✓ Allowed" : "✗ Not Allowed";
    case "income":
      return post.postDetail?.income || "—";
    case "size":
      return post.postDetail?.size ? `${post.postDetail.size} sqft` : "—";
    case "school":
      return post.postDetail?.school != null ? `${post.postDetail.school}m` : "—";
    case "bus":
      return post.postDetail?.bus != null ? `${post.postDetail.bus}m` : "—";
    case "restaurant":
      return post.postDetail?.restaurant != null ? `${post.postDetail.restaurant}m` : "—";
    default:
      return post[key] ?? "—";
  }
}

function ComparePage() {
  const compareIds = useCompareStore((s) => s.compareIds);
  const clearCompare = useCompareStore((s) => s.clearCompare);
  const removeFromCompare = useCompareStore((s) => s.removeFromCompare);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (compareIds.length === 0) {
      setPosts([]);
      return;
    }
    setLoading(true);
    setError("");
    Promise.allSettled(compareIds.map((id) => apiRequest(`/posts/${id}`)))
      .then((results) => {
        const fetched = results.map((r, i) =>
          r.status === "fulfilled" ? r.value.data : null
        );
        setPosts(fetched);
      })
      .catch(() => setError("Failed to load some listings."))
      .finally(() => setLoading(false));
  }, [compareIds]);

  // Empty / insufficient state
  if (compareIds.length === 0) {
    return (
      <div className="compare-page__empty">
        <div className="text-7xl mb-5">🏠</div>
        <h1 className="font-heading text-display-sm text-navy-900 mb-3">No Listings Selected</h1>
        <p className="font-body text-body text-navy-400 mb-8 max-w-md mx-auto text-center">
          Browse listings and click the compare icon on any property card to start comparing.
        </p>
        <button onClick={() => navigate("/list")} className="btn-primary">
          Browse Listings
        </button>
      </div>
    );
  }

  if (compareIds.length === 1) {
    return (
      <div className="compare-page__empty">
        <div className="text-7xl mb-5">📋</div>
        <h1 className="font-heading text-display-sm text-navy-900 mb-3">Select One More</h1>
        <p className="font-body text-body text-navy-400 mb-8 max-w-md mx-auto text-center">
          You need at least 2 listings to compare. Head back and add one more.
        </p>
        <button onClick={() => navigate(-1)} className="btn-primary">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <div className="section-container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-display-sm text-navy-900 mb-1">
              Compare Listings
            </h1>
            <p className="font-body text-body-sm text-navy-400">
              Comparing {compareIds.length} {compareIds.length === 1 ? "property" : "properties"} side by side
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="btn-outline !py-2 !px-4">
              ← Back
            </button>
            <button onClick={clearCompare} className="btn-ghost !text-red-500 hover:!bg-red-50">
              Clear All
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 text-navy-400 font-body">
            <div className="compare-page__spinner mx-auto mb-4" />
            Loading listings…
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-btn p-4 font-body text-body-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="compare-page__table-wrapper">
            <table className="compare-page__table">
              <colgroup>
                <col className="compare-page__label-col" />
                {posts.map((_, i) => (
                  <col key={i} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th className="compare-page__th compare-page__th--label"></th>
                  {posts.map((post, i) => (
                    <th key={i} className="compare-page__th">
                      <div className="compare-page__th-inner">
                        <span className="compare-page__th-name">{post?.title || "Loading…"}</span>
                        <button
                          onClick={() => removeFromCompare(compareIds[i])}
                          className="compare-page__th-remove"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, ri) => (
                  <tr key={row.key} className={ri % 2 === 0 ? "compare-page__tr--even" : "compare-page__tr--odd"}>
                    <td className="compare-page__td compare-page__td--label">{row.label}</td>
                    {posts.map((post, pi) => (
                      <td key={pi} className="compare-page__td">
                        {cellValue(post, row.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComparePage;
