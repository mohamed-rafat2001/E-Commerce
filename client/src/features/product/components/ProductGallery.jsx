import { Slider } from '../../../shared/ui/index.js';

const ProductGallery = ({ gallery, enableZoom = true }) => {
  return (
    <div className="relative">
      <Slider
        images={gallery}
        thumbnails
        navigation
        autoplay
        enableZoom={enableZoom}
        aspectClass="aspect-square"
        showCounter
        counterPosition="top-right"
        counterClass="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium"
      />
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 border border-gray-200">
        {gallery.length} {gallery.length === 1 ? 'Image' : 'Images'}
      </div>
    </div>
  );
};

export default ProductGallery;
