import { useState, useEffect } from 'react';

const cache = new Map();

/**
 * Hook to generate images using Banana AI
 * Fallback to placeholder if API is not yet configured or fails
 */
export const useBananaAI = (prompt, width = 1024, height = 1024) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!prompt) {
            setIsLoading(false);
            return;
        }

        const cacheKey = `${prompt}_${width}x${height}`;
        if (cache.has(cacheKey)) {
            setImageUrl(cache.get(cacheKey));
            setIsLoading(false);
            return;
        }

        const generateImage = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Banana AI API call placeholder
                // Since we don't have the API Key, we use high-quality Unsplash/Placeholder fallback
                // The user can later update this with actual banana-python or axios call

                const fallbackUrl = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=${width}&h=${height}`;

                // Mock delay to simulate generation
                await new Promise(resolve => setTimeout(resolve, 800));

                cache.set(cacheKey, fallbackUrl);
                setImageUrl(fallbackUrl);
            } catch (err) {
                console.error("Banana AI error:", err);
                setError("Failed to generate image");
            } finally {
                setIsLoading(false);
            }
        };

        generateImage();
    }, [prompt, width, height]);

    return { imageUrl, isLoading, error };
};

export default useBananaAI;
