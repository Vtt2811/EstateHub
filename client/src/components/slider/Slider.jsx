import { useState } from "react";
import "./slider.scss";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  const changeSlide = (direction) => {
    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Lightbox Modal */}
      {imageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-md flex items-center justify-between p-4 md:p-8">
          <button
            onClick={() => changeSlide("left")}
            className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            ←
          </button>
          <div className="max-w-4xl max-h-[85vh] p-2">
            <img
              src={images[imageIndex]}
              alt=""
              className="max-w-full max-h-[80vh] object-contain rounded-card mx-auto shadow-elevated"
            />
          </div>
          <button
            onClick={() => changeSlide("right")}
            className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            →
          </button>
          <button
            onClick={() => setImageIndex(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid Layout Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] md:h-[420px]">
        {/* Main Big Image */}
        <div
          className="md:col-span-3 h-full rounded-card overflow-hidden cursor-pointer shadow-card group"
          onClick={() => setImageIndex(0)}
        >
          <img
            src={images[0] || "/default-image.jpg"}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Small Images */}
        <div className="hidden md:flex flex-col gap-3 h-full">
          {images.slice(1, 4).map((image, index) => (
            <div
              key={index}
              className="flex-1 rounded-card overflow-hidden cursor-pointer shadow-card group relative"
              onClick={() => setImageIndex(index + 1)}
            >
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {index === 2 && images.length > 4 && (
                <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-[2px] flex items-center justify-center text-white font-body font-bold text-body">
                  +{images.length - 4} more
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Slider;
