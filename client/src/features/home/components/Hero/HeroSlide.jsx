import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '../../../../shared/ui';
import OptimizedImage from '../../../../shared/components/OptimizedImage.jsx';

const HeroSlide = ({ slide, priority = false }) => {
    const imageUrl = slide.image;
    const navigate = useNavigate();

    return (
        <div className="relative h-full w-full flex items-center overflow-hidden">
            {/* Background Image Container optimized for LCP */}
            <div className="absolute inset-0 z-0">
                <OptimizedImage
                    src={imageUrl}
                    alt={slide.title}
                    priority={priority}
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="max-w-2xl text-white">
                        <Badge variant="featured" className="mb-6 uppercase tracking-[0.2em] px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-xs shadow-xl">
                            {slide.badge}
                        </Badge>

                        <h1
                            className="text-5xl md:text-7xl lg:text-[5rem] font-black font-display mb-6 leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-400 drop-shadow-sm"
                        >
                            {slide.title}
                        </h1>

                        <p
                            className="text-lg md:text-2xl text-gray-200 mb-10 leading-relaxed font-medium max-w-xl drop-shadow"
                        >
                            {slide.description}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={() => navigate('/products')} variant="premium" size="lg" className="px-10">
                                Shop Now
                            </Button>
                            <Button
                                onClick={() => navigate('/register')}
                                variant="outline"
                                size="lg"
                                className="px-10 !text-white !border-white hover:!bg-white hover:text-gray-900"
                            >
                                Sell With Us
                            </Button>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSlide;
