import { Slider } from '../../../shared/ui/index.js';

const ProductGallery = ({ gallery, enableZoom = false }) => {
  return (
    <Slider
      images={gallery}
      thumbnails
      navigation
      autoplay
      enableZoom={enableZoom}
      aspectClass="aspect-square"
    />
  );
};

export default ProductGallery;
