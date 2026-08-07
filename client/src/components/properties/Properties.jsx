import React from 'react';
import { Link } from 'react-router-dom';
import { VscSettings } from 'react-icons/vsc';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { PROPERTIES } from './data';
import Item from './Item'; // Ensure this component is created and correctly imported

const Properties = () => {
  return (
    <section className="px-4 md:px-8 lg:px-16 py-8 bg-gray-100">
      <div className="bg-white py-16 xl:py-28 rounded-3xl shadow-lg">
        <span className="text-xl font-medium text-gray-700">Your Future Home Awaits!</span>
        <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-6">Find Your Dream Here</h2>
        <div className="flex justify-between items-center mb-6">
          <h5 className="text-gray-600"><span>Showing 1-9</span> out of 3k properties</h5>
          <Link to={'/'}><VscSettings className="text-gray-700 text-xl" /></Link>
        </div>
        {/* Swiper container */}
        <Swiper
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            600: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1124: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1300: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          modules={[Autoplay]}
          className="h-[488px] md:h-[533px] mt-5"
        >
          {PROPERTIES.map((property) => (
            <SwiperSlide key={property.title}>
              <Item property={property} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Properties;
