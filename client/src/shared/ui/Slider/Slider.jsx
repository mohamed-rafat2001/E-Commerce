import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Autoplay, Zoom } from 'swiper/modules';
import { FiZoomIn, FiZoomOut, FiMaximize } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

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
    <div className={className}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Thumbs, Autoplay, Zoom]}
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
        zoom={enableZoom ? { maxRatio: 4, minRatio: 1 } : false}
        className="rounded-2xl"
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx} zoom={enableZoom}>
            <div className={`${aspectClass} bg-gray-50 flex items-center justify-center overflow-hidden`}>
              <img
                src={src}
                alt=""
                className={`w-full h-full object-contain ${imageClassName}`}
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

      {/* Zoom Controls */}
      {enableZoom && (
        <div className="flex justify-center gap-2 mt-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
            title="Zoom Out"
          >
            <FiZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-medium"
            title="Reset Zoom"
          >
            {zoomLevel.toFixed(1)}x
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
            title="Zoom In"
          >
            <FiZoomIn className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Slider;

