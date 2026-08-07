import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper"; // Direct import from swiper
import List from "../../components/list/List"; // Assuming List component is used to display properties
import apiRequest from "../../lib/apiRequest"; // Importing the custom Axios instance
import "swiper/css"; // Import Swiper core styles
import "swiper/css/navigation"; // Import Swiper navigation styles
import "swiper/css/pagination"; // Import pagination styles (optional)

const PropertyPage = () => {
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    // Fetch Rent Listings
    const fetchRentListings = async () => {
      try {
        const res = await apiRequest.get("/posts?type=rent&limit=6");
        setRentListings(res.data);
        fetchSaleListings(); // Fetch sale listings after rent listings
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch Sale Listings
    const fetchSaleListings = async () => {
      try {
        const res = await apiRequest.get("/posts?type=buy&limit=6");
        setSaleListings(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    // Start by fetching rent listings
    fetchRentListings();
  }, []);

  return (
    <section>
      <div className="propertyPage">
        {/* Rent Listings */}
        <section className="px-0 md:px-0 lg:px-0 py-0 bg-white">
          <div className="py-16 xl:py-28">
            <span className="text-xl font-medium text-gray-700">
              Rent Listings
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-6">
              Available for Rent
            </h2>

            <Swiper
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                600: { slidesPerView: 2, spaceBetween: 30 },
                1124: { slidesPerView: 3, spaceBetween: 30 },
                1300: { slidesPerView: 4, spaceBetween: 30 },
              }}
              modules={[Navigation]}
              className="h-[488px] md:h-[533px] mt-5"
            >
              {rentListings.map((listing) => (
                <SwiperSlide key={listing.id}>
                  <List posts={[listing]} isMyListing={false} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Sale Listings */}
        <section className="px-0 md:px-0 lg:px-0 py-0 bg-white">
          <div className="py-16 xl:py-28">
            <span className="text-xl font-medium text-gray-700">
              Sale Listings
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-6">
              Available for Sale
            </h2>

            <Swiper
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                600: { slidesPerView: 2, spaceBetween: 30 },
                1124: { slidesPerView: 3, spaceBetween: 30 },
                1300: { slidesPerView: 4, spaceBetween: 30 },
              }}
              modules={[Navigation]}
              className="h-[488px] md:h-[533px] mt-5"
            >
              {saleListings.map((listing) => (
                <SwiperSlide key={listing.id}>
                  <List posts={[listing]} isMyListing={false} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </div>
    </section>
  );
};

export default PropertyPage;
