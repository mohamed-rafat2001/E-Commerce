import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const DEFAULT_IMG = 'https://placehold.co/600x600?text=No+Image';

const Slider = ({
  images = [],
  className = '',
  imageClassName = '',
  aspectClass = 'aspect-square',
  thumbnails = true,
  navigation = true,
  autoplay = true,
  autoplayDelay = 3000,
  enableZoom = false,
}) => {
  const [thumbs, setThumbs] = useState(null);
  const slides = images.length ? images : [DEFAULT_IMG];

  return (
    <div className={className}>
      <Swiper
        modules={[Navigation, Thumbs, Autoplay]}
        navigation={navigation}
        thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        className="rounded-2xl"
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className={`${aspectClass} bg-gray-50 flex items-center justify-center overflow-hidden`}>
              <img
                src={src}
                alt=""
                className={`w-full h-full object-contain ${
                  enableZoom ? 'transition-transform duration-300 hover:scale-110 cursor-zoom-in' : ''
                } ${imageClassName}`}
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMG;
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {thumbnails && slides.length > 1 && (
        <Swiper
          onSwiper={setThumbs}
          modules={[Thumbs]}
          spaceBetween={8}
          slidesPerView={5}
          watchSlidesProgress
          className="mt-3"
        >
          {slides.map((src, idx) => (
            <SwiperSlide key={`thumb-${idx}`}>
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-100">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMG;
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Slider;

