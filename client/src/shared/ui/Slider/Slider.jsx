import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Autoplay, Zoom, EffectFade, Pagination } from 'swiper/modules';
import { FiZoomIn, FiZoomOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const DEFAULT_IMG = 'https://placehold.co/600x600?text=No+Image';

/**
 * Generic Slider Component
 * Supports:
 * 1. Image array (simple image slider with optional zoom/thumbs)
 * 2. Children (custom slides content)
 */
const Slider = ({
  images = [],
  children,
  className = '',
  swiperClassName = '',
  slideClassName = '',
  aspectClass = 'aspect-square',
  thumbnails = false,
  navigation = true,
  pagination = false,
  autoplay = true,
  autoplayDelay = 5000,
  enableZoom = false,
  slidesPerView = 1,
  spaceBetween = 0,
  breakpoints = {},
  loop = true,
  effect = 'slide', // 'slide' | 'fade'
  speed = 500,
  centeredSlides = false,
  nextEl,
  prevEl,
}) => {
  const [thumbs, setThumbs] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const swiperRef = useRef(null);

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

  // If children are provided, we use them as slides.
  // Otherwise, we map over images.
  const hasChildren = Boolean(children);
  const slidesCount = hasChildren ? (Array.isArray(children) ? children.length : 1) : images.length;

  return (
    <div className={`relative group/slider ${className}`}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Thumbs, Autoplay, Zoom, EffectFade, Pagination]}
        navigation={navigation ? {
          nextEl: nextEl || '.custom-swiper-next',
          prevEl: prevEl || '.custom-swiper-prev',
        } : false}
        pagination={pagination ? (typeof pagination === 'object' ? pagination : { clickable: true }) : false}
        effect={effect}
        fadeEffect={effect === 'fade' ? { crossFade: true } : undefined}
        thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
        autoplay={
          autoplay
            ? {
              delay: autoplayDelay,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              ... (typeof autoplay === 'object' ? autoplay : {})
            }
            : false
        }
        zoom={enableZoom ? { maxRatio: 4, minRatio: 1 } : false}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        breakpoints={breakpoints}
        loop={loop}
        speed={speed}
        centeredSlides={centeredSlides}
        className={`${swiperClassName}`}
      >
        {hasChildren ? (
          // Custom Slides
          Array.isArray(children) ? (
            children.map((child, idx) => (
              <SwiperSlide key={idx} className={slideClassName}>
                {child}
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className={slideClassName}>{children}</SwiperSlide>
          )
        ) : (
          // Image Slides (Backward compatibility & default mode)
          images.length > 0 ? images.map((src, idx) => (
            <SwiperSlide key={idx} zoom={enableZoom} className={slideClassName}>
              <div className={`${aspectClass} bg-white flex items-center justify-center overflow-hidden p-4 md:p-8`}>
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-contain mix-blend-multiply drag-none select-none transition-transform duration-700"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMG;
                  }}
                />
              </div>
            </SwiperSlide>
          )) : (
            <SwiperSlide>
              <div className={`${aspectClass} bg-white flex items-center justify-center`}>
                <img src={DEFAULT_IMG} alt="No image" className="w-full h-full object-contain" />
              </div>
            </SwiperSlide>
          )
        )}

        {/* Custom Navigation Buttons (Default ones if no custom selectors provided) */}
        {navigation && slidesCount > 1 && !nextEl && (
          <>
            <button className="custom-swiper-prev absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl flex items-center justify-center text-gray-900 opacity-100 transition-all duration-500 hover:bg-black hover:text-white group/btn">
              <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>
            <button className="custom-swiper-next absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl flex items-center justify-center text-gray-900 opacity-100 transition-all duration-500 hover:bg-black hover:text-white group/btn">
              <FiChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}
      </Swiper>

      {/* Thumbnails Mode (Only for image sliders) */}
      {thumbnails && !hasChildren && images.length > 1 && (
        <div className="mt-6 md:mt-8 px-1 md:px-2">
          <Swiper
            onSwiper={setThumbs}
            modules={[Thumbs]}
            spaceBetween={10}
            slidesPerView={3}
            breakpoints={{
              480: { slidesPerView: 4, spaceBetween: 12 },
              768: { slidesPerView: 5, spaceBetween: 16 }
            }}
            watchSlidesProgress
            className="thumb-swiper"
          >
            {images.map((src, idx) => (
              <SwiperSlide key={`thumb-${idx}`} className="cursor-pointer">
                {({ isActive }) => (
                  <div className={`aspect-square rounded-xl md:rounded-[1.5rem] overflow-hidden border-2 transition-all duration-500 p-1.5 md:p-2 bg-white ${isActive ? 'border-indigo-600 shadow-lg shadow-indigo-100 scale-105' : 'border-gray-100 opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
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

      {/* Zoom Controls (Only for zoom enabled) */}
      {enableZoom && (
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20 flex gap-2">
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 md:p-1.5 rounded-xl md:rounded-2xl shadow-2xl border border-white/50">
            <button
              onClick={handleZoomOut}
              className="p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <FiZoomOut className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-900 text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-black tracking-widest min-w-[3.5rem] md:min-w-[5rem] text-center hover:bg-indigo-600 transition-colors"
              title="Reset Zoom"
            >
              {zoomLevel.toFixed(1)}X
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <FiZoomIn className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;



