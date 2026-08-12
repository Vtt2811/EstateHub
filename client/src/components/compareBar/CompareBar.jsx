import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompareStore } from "../../lib/compareStore";
import apiRequest from "../../lib/apiRequest";
import "./compareBar.scss";

function CompareBar() {
  const compareIds = useCompareStore((s) => s.compareIds);
  const removeFromCompare = useCompareStore((s) => s.removeFromCompare);
  const clearCompare = useCompareStore((s) => s.clearCompare);
  const navigate = useNavigate();

  const [posts, setPosts] = useState({});

  // Fetch thumbnail data for each ID in compareIds
  useEffect(() => {
    const fetchMissing = async () => {
      const missing = compareIds.filter((id) => !posts[id]);
      if (missing.length === 0) return;
      const results = await Promise.allSettled(
        missing.map((id) => apiRequest(`/posts/${id}`))
      );
      const newPosts = {};
      results.forEach((res, i) => {
        if (res.status === "fulfilled") {
          newPosts[missing[i]] = res.value.data;
        }
      });
      setPosts((prev) => ({ ...prev, ...newPosts }));
    };
    fetchMissing();
    // Clean up posts that are no longer in compareIds
    setPosts((prev) => {
      const next = {};
      compareIds.forEach((id) => { if (prev[id]) next[id] = prev[id]; });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareIds]);

  if (compareIds.length < 1) return null;

  const visible = compareIds.length >= 2;

  return (
    <div className={`compare-bar ${visible ? "compare-bar--visible" : "compare-bar--hint"}`}>
      <div className="compare-bar__inner section-container">
        {/* Left: thumbnails */}
        <div className="compare-bar__items">
          {compareIds.map((id) => {
            const post = posts[id];
            return (
              <div key={id} className="compare-bar__thumb">
                {post ? (
                  <>
                    <img
                      src={post.images?.[0] || "/default-image.jpg"}
                      alt={post.title}
                      className="compare-bar__thumb-img"
                    />
                    <div className="compare-bar__thumb-info">
                      <span className="compare-bar__thumb-title">{post.title}</span>
                      <span className="compare-bar__thumb-price">${post.price?.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="compare-bar__thumb-loading">Loading…</div>
                )}
                <button
                  onClick={() => removeFromCompare(id)}
                  className="compare-bar__thumb-remove"
                  title="Remove from compare"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: actions */}
        <div className="compare-bar__actions">
          {compareIds.length < 2 && (
            <p className="compare-bar__hint-text">Select {2 - compareIds.length} more to compare</p>
          )}
          {compareIds.length >= 2 && (
            <button
              className="btn-primary !py-2.5 !px-5"
              onClick={() => navigate("/compare")}
            >
              Compare Now
            </button>
          )}
          <button
            className="btn-ghost !text-navy-400 !text-caption"
            onClick={clearCompare}
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompareBar;
