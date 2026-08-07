import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)]">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 lg:w-3/5">
          <div className="section-container py-6 lg:pr-8">
            {/* Image Gallery */}
            <Slider images={post.images} />

            {/* Property Header */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-3">
                <h1 className="font-heading text-display-sm md:text-heading text-navy-900">
                  {post.title}
                </h1>
                <div className="flex items-center gap-2 text-navy-400 font-body text-body-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{post.address}</span>
                </div>
                <div className="inline-block px-4 py-2 bg-accent-50 border border-accent-200 rounded-btn">
                  <span className="font-heading text-2xl font-bold text-accent-600">
                    ${post.price.toLocaleString()}
                  </span>
                  {post.type === "rent" && (
                    <span className="text-navy-400 font-body text-body-sm">/month</span>
                  )}
                </div>
              </div>

              {/* Agent Card (mobile) */}
              <div className="bg-surface-50 border border-surface-200 rounded-card p-4 flex items-center gap-4 sm:min-w-[200px]">
                <img
                  src={post.user.avatar || "/noavatar.jpg"}
                  alt={post.user.username}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-surface-200"
                />
                <div>
                  <p className="font-body font-semibold text-navy-800">{post.user.username}</p>
                  <p className="text-navy-400 font-body text-caption">Property Owner</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 prose prose-navy max-w-none font-body text-navy-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-2/5 bg-surface-50 border-l border-surface-200">
          <div className="p-6 lg:p-8 space-y-6 lg:sticky lg:top-[72px] lg:max-h-[calc(100vh-72px)] lg:overflow-y-auto">

            {/* General Info */}
            <div>
              <h3 className="font-heading text-lg font-bold text-navy-900 mb-4">General</h3>
              <div className="bg-white rounded-card p-4 space-y-4 shadow-card">
                {[
                  { icon: "⚡", label: "Utilities", value: post.postDetail.utilities === "owner" ? "Owner is responsible" : "Tenant is responsible" },
                  { icon: "🐾", label: "Pet Policy", value: post.postDetail.pet === "allowed" ? "Pets Allowed" : "Pets not Allowed" },
                  { icon: "💰", label: "Income Policy", value: post.postDetail.income || "N/A" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-50 rounded-btn flex items-center justify-center text-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-body-sm text-navy-800">{item.label}</p>
                      <p className="font-body text-body-sm text-navy-400">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-heading text-lg font-bold text-navy-900 mb-4">Property Details</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "📐", label: "Size", value: `${post.postDetail.size || 0} sqft` },
                  { icon: "🛏️", label: "Bedrooms", value: `${post.bedroom}` },
                  { icon: "🚿", label: "Bathrooms", value: `${post.bathroom}` },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-card p-3 text-center shadow-card">
                    <span className="text-2xl block mb-1">{item.icon}</span>
                    <p className="font-body font-bold text-body-sm text-navy-800">{item.value}</p>
                    <p className="font-body text-caption text-navy-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div>
              <h3 className="font-heading text-lg font-bold text-navy-900 mb-4">Nearby Places</h3>
              <div className="bg-white rounded-card p-4 shadow-card">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: "🏫", label: "School", value: post.postDetail.school > 999 ? `${post.postDetail.school / 1000}km` : `${post.postDetail.school}m` },
                    { icon: "🚌", label: "Bus Stop", value: `${post.postDetail.bus}m` },
                    { icon: "🍽️", label: "Restaurant", value: `${post.postDetail.restaurant}m` },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <span className="text-xl block mb-1">{item.icon}</span>
                      <p className="font-body font-semibold text-body-sm text-navy-800">{item.value}</p>
                      <p className="font-body text-caption text-navy-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="font-heading text-lg font-bold text-navy-900 mb-4">Location</h3>
              <div className="rounded-card overflow-hidden shadow-card h-[220px]">
                <Map items={[post]} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="btn-primary flex-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send Message
              </button>
              <button
                onClick={handleSave}
                className={`btn-outline !px-4 ${saved ? '!bg-gold-50 !border-gold-300 !text-gold-700' : ''}`}
              >
                <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
