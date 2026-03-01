import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Autoplay, Zoom, EffectFade } from 'swiper/modules';
import { FiZoomIn, FiZoomOut, FiMaximize, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/effect-fade';

const DEFAULT_IMG = 'https://placehold.co/600x600?text=No+Image';

const Slider = ({
  images = [],
  className = '',
  imageClassName = '',
  aspectClass = 'aspect-square',
  thumbnails = true,
  navigation = true,
  autoplay = true,
  autoplayDelay = 5000,
  enableZoom = false,
}) => {
  const [thumbs, setThumbs] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const swiperRef = useRef(null);
  const slides = images.length ? images : [DEFAULT_IMG];

  const handleZoomIn = () => {
    if (swiperRef.current && swiperRef.current.zoom) {
      const zoom = swiperRef.current.zoom;
      const newScale = Math.min(zoom.scale * 1.5, 4);
      zoom.in(newScale);
      setZoomLevel(newScale);
    }
  };

  const handleZoomOut = () => {
    if (swiperRef.current && swiperRef.current.zoom) {
      const zoom = swiperRef.current.zoom;
      const newScale = Math.max(zoom.scale / 1.5, 1);
      zoom.out(newScale);
      setZoomLevel(newScale);
    }
  };

  const handleResetZoom = () => {
    if (swiperRef.current && swiperRef.current.zoom) {
      swiperRef.current.zoom.out();
      setZoomLevel(1);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Thumbs, Autoplay, Zoom, EffectFade]}
        navigation={{
          nextEl: '.custom-swiper-next',
          prevEl: '.custom-swiper-prev',
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
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
        zoom={enableZoom ? { maxRatio: 4, minRatio: 1 } : false}
        className="rounded-[2.5rem] shadow-2xl relative group bg-white border border-gray-100/50"
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx} zoom={enableZoom}>
            <div className={`${aspectClass} bg-white flex items-center justify-center overflow-hidden p-8`}>
              <img
                src={src}
                alt=""
                className={`w-full h-full object-contain mix-blend-multiply drag-none select-none transition-transform duration-700 ${imageClassName}`}
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_IMG;
                }}
              />
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        {navigation && slides.length > 1 && (
          <>
            <button className="custom-swiper-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 hover:bg-black hover:text-white group/btn">
              <FiChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>
            <button className="custom-swiper-next absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 hover:bg-black hover:text-white group/btn">
              <FiChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}
      </Swiper>

      {thumbnails && slides.length > 1 && (
        <div className="mt-8 px-2">
          <Swiper
            onSwiper={setThumbs}
            modules={[Thumbs]}
            spaceBetween={16}
            slidesPerView={5}
            watchSlidesProgress
            className="thumb-swiper"
          >
            {slides.map((src, idx) => (
              <SwiperSlide key={`thumb-${idx}`} className="cursor-pointer">
                {({ isActive }) => (
                  <div className={`aspect-square rounded-[1.5rem] overflow-hidden border-2 transition-all duration-500 p-2 bg-white ${
                    isActive ? 'border-indigo-600 shadow-lg shadow-indigo-100 scale-105' : 'border-gray-100 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
                  }`}>
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-contain mix-blend-multiply"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMG;
                      }}
                    />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Zoom Controls Overlay */}
      {enableZoom && (
        <div className="absolute bottom-8 right-8 z-20 flex gap-2">
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border border-white/50">
            <button
               onClick={handleZoomOut}
               className="p-3 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            >
               <FiZoomOut className="w-5 h-5" />
            </button>
            <button
               onClick={handleResetZoom}
               className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black tracking-widest min-w-[5rem] text-center hover:bg-indigo-600 transition-colors"
               title="Reset Zoom"
            >
               {zoomLevel.toFixed(1)}X
            </button>
            <button
               onClick={handleZoomIn}
               className="p-3 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            >
               <FiZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;


