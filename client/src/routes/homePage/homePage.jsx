import { useContext, useEffect, useState } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import CountUp from "react-countup";
import Footer from "../../components/footer/Footer";

import { Link } from "react-router-dom";
import { BLOGS } from "../../components/properties/data";
import apiRequest from "../../lib/apiRequest";
import List from "../../components/list/List";

function HomePage() {
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        const res = await apiRequest.get("/posts?type=rent");
        setRentListings(res.data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const res = await apiRequest.get("/posts?type=buy");
        setSaleListings(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRentListings();
  }, []);

  const { currentUser } = useContext(AuthContext);

  const statistics = [
    { label: "Happy Clients", value: 12, suffix: "k+" },
    { label: "Cities Covered", value: 3, suffix: "+" },
    { label: "Properties Listed", value: 45, suffix: "k+" },
  ];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById("stats-section");
      if (statsSection) {
        const top = statsSection.getBoundingClientRect().top;
        const isVisible = top < window.innerHeight - 100;
        setIsVisible(isVisible);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [expandedBlog, setExpandedBlog] = useState(null);
  const handleToggle = (title) => {
    setExpandedBlog(expandedBlog === title ? null : title);
  };

  return (
    <div className="font-body">
      {/* ═══════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/80 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

        <div className="section-container relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-pill border border-white/10 mb-6">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              <span className="text-accent-300 font-body text-caption font-medium uppercase tracking-wider">
                Trusted by 12,000+ clients
              </span>
            </div>

            <h1 className="font-heading text-display-sm md:text-display lg:text-display-xl text-white mb-6 leading-tight">
              Find Your <span className="text-accent-400">Perfect</span> Place to Call Home
            </h1>

            <p className="text-navy-300 text-body-lg mb-10 max-w-lg leading-relaxed">
              Discover exceptional properties tailored to your lifestyle. From luxury apartments to family homes — your dream property awaits.
            </p>

            <SearchBar />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* STATS BAR */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="stats-section" className="relative -mt-8 z-20">
        <div className="section-container">
          <div className="bg-white rounded-card shadow-elevated p-6 md:p-8">
            <div className="grid grid-cols-3 divide-x divide-surface-200">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center px-4">
                  <div className="flex items-center justify-center gap-0.5">
                    <CountUp
                      start={isVisible ? 0 : null}
                      end={stat.value}
                      duration={3}
                      delay={0.5}
                    >
                      {({ countUpRef }) => (
                        <span
                          ref={countUpRef}
                          className="font-heading text-display-sm md:text-display text-navy-900"
                        />
                      )}
                    </CountUp>
                    <span className="font-heading text-display-sm md:text-display text-accent-500">{stat.suffix}</span>
                  </div>
                  <p className="text-navy-400 font-body text-body-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* RENT LISTINGS */}
      {/* ═══════════════════════════════════════════════════ */}
      {rentListings.length > 0 && (
        <section className="section-padding">
          <div className="section-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-accent-500 font-body font-semibold text-body-sm uppercase tracking-wider">
                  Featured Rentals
                </span>
                <h2 className="font-heading text-display-sm md:text-heading text-navy-900 mt-2">
                  Available for Rent
                </h2>
              </div>
              <Link to="/list?type=rent" className="btn-outline hidden sm:inline-flex">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rentListings.slice(0, 4).map((listing) => (
                <div key={listing.id}>
                  <List posts={[listing]} isMyListing={false} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* SALE LISTINGS */}
      {/* ═══════════════════════════════════════════════════ */}
      {saleListings.length > 0 && (
        <section className="section-padding bg-surface-100/50">
          <div className="section-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-accent-500 font-body font-semibold text-body-sm uppercase tracking-wider">
                  Premium Properties
                </span>
                <h2 className="font-heading text-display-sm md:text-heading text-navy-900 mt-2">
                  Available for Sale
                </h2>
              </div>
              <Link to="/list?type=buy" className="btn-outline hidden sm:inline-flex">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleListings.slice(0, 4).map((listing) => (
                <div key={listing.id}>
                  <List posts={[listing]} isMyListing={false} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* BLOG SECTION */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="section-container">
          <div className="text-center mb-12">
            <span className="text-accent-500 font-body font-semibold text-body-sm uppercase tracking-wider">
              Insights & Tips
            </span>
            <h2 className="font-heading text-display-sm md:text-heading text-navy-900 mt-2">
              Expert Real Estate Blog
            </h2>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {BLOGS.map((blog) => (
              <div
                key={blog.title}
                className="card-base group cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="inline-block px-3 py-1 bg-accent-500/90 backdrop-blur-sm text-white font-body text-caption font-semibold rounded-pill mb-3">
                      {blog.category}
                    </span>
                    <h3 className="text-white font-heading text-lg font-bold leading-snug">
                      {blog.title}
                    </h3>
                    <button
                      className="mt-3 text-accent-300 font-body text-body-sm font-medium hover:text-accent-200 transition-colors"
                      onClick={() => handleToggle(blog.title)}
                    >
                      {expandedBlog === blog.title ? "Show Less ↑" : "Read More →"}
                    </button>
                    {expandedBlog === blog.title && (
                      <p className="mt-3 text-navy-200 font-body text-body-sm leading-relaxed">
                        Discover the latest trends and insights in real estate. From market analysis to home buying tips, we cover everything you need to know.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* CTA SECTION */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-navy-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="section-container relative z-10 text-center">
          <h2 className="font-heading text-display-sm md:text-display text-white mb-4">
            Ready to Make a Move?
          </h2>
          <p className="text-navy-300 text-body-lg mb-8 max-w-xl mx-auto">
            Whether you're buying, selling, or renting — we're here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/list" className="btn-primary !py-3.5 !px-8 !text-body">
              Browse Properties
            </Link>
            <Link to="/register" className="btn-outline !border-navy-600 !text-navy-200 hover:!bg-navy-800 !py-3.5 !px-8 !text-body">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default HomePage;
