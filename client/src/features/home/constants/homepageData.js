import {
    FiShoppingBag,
    FiTrendingUp,
    FiShield,
    FiSearch,
    FiTruck,
    FiUsers,
    FiPieChart
} from 'react-icons/fi';

export const HERO_SLIDES = [
    {
        id: 1,
        title: "The Most Advanced",
        subtitle: "Marketplace Engine",
        description: "Experience the future of electronics with Banana AI. Cutting-edge technology meet minimalist design.",
        image: "/home/mohamed/.gemini/antigravity/brain/4ed92d1c-34b0-4aaa-aaef-86b0e3c0af4a/banana_ai_hero_electronics_1772759743842.png",
        badge: "🚀 Next-Gen Tech",
        color: "from-indigo-400 to-purple-400"
    },
    {
        id: 2,
        title: "Redefine Your",
        subtitle: "Personal Style",
        description: "Discover curated fashion collections that blend comfort with avant-garde aesthetics.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        badge: "✨ Premium Fashion",
        color: "from-pink-400 to-rose-400"
    },
    {
        id: 3,
        title: "Design Your",
        subtitle: "Modern Workspace",
        description: "Productivity meets elegance. Explore our range of ergonomic and tech-integrated office solutions.",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop",
        badge: "💼 Elite Office",
        color: "from-amber-400 to-orange-400"
    }
];

export const CATEGORIES = [
    { name: 'Electronics', icon: '📱', count: '2,453', color: 'bg-blue-50', hoverColor: 'group-hover:bg-blue-100' },
    { name: 'Fashion', icon: '👕', count: '5,821', color: 'bg-pink-50', hoverColor: 'group-hover:bg-pink-100' },
    { name: 'Home & Garden', icon: '🏡', count: '1,234', color: 'bg-green-50', hoverColor: 'group-hover:bg-green-100' },
    { name: 'Sports', icon: '⚽', count: '987', color: 'bg-orange-50', hoverColor: 'group-hover:bg-orange-100' },
    { name: 'Beauty', icon: '💄', count: '2,156', color: 'bg-purple-50', hoverColor: 'group-hover:bg-purple-100' },
    { name: 'Books', icon: '📚', count: '3,478', color: 'bg-yellow-50', hoverColor: 'group-hover:bg-yellow-100' },
    { name: 'Accessories', icon: '⌚', count: '1,120', color: 'bg-indigo-50', hoverColor: 'group-hover:bg-indigo-100' },
    { name: 'Gaming', icon: '🎮', count: '850', color: 'bg-red-50', hoverColor: 'group-hover:bg-red-100' },
];

export const FEATURED_PRODUCTS = [
    {
        id: 1,
        name: 'Elite Wireless Headphones',
        price: '$299',
        image: '/images/headphones.png',
        category: 'Electronics',
        rating: 4.8,
        reviews: '1.2k'
    },
    {
        id: 2,
        name: 'Smart Watch Pro Max',
        price: '$399',
        image: '/images/smart-watch.png',
        category: 'Wearables',
        rating: 4.9,
        reviews: '850'
    },
    {
        id: 3,
        name: 'Ergonomic Laptop Stand',
        price: '$79',
        image: '/images/laptop-stand.png',
        category: 'Accessories',
        rating: 4.7,
        reviews: '2.4k'
    },
    {
        id: 4,
        name: 'Mechanical RGB Keyboard',
        price: '$159',
        image: '/images/keyboard.png',
        category: 'Electronics',
        rating: 4.6,
        reviews: '530'
    },
    {
        id: 5,
        name: 'Ultrawide Curved Monitor',
        price: '$899',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop',
        category: 'Electronics',
        rating: 4.9,
        reviews: '310'
    },
    {
        id: 6,
        name: 'Minimalist Leather Wallet',
        price: '$45',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1974&auto=format&fit=crop',
        category: 'Fashion',
        rating: 4.5,
        reviews: '1.1k'
    }
];

export const BRANDS = [
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
    { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
    { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Logitech', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg' }
];

export const FEATURES = [
    {
        title: 'For Shoppers',
        description: 'Discover curated collections, personalized recommendations, and secure checkout with multiple payment options.',
        icon: <FiShoppingBag className="w-6 h-6" />,
        color: 'indigo',
        links: [
            { label: 'Smart Filtering', icon: <FiSearch /> },
            { label: 'Wishlist Sync', icon: <FiShield /> },
            { label: 'Order Tracking', icon: <FiTruck /> }
        ]
    },
    {
        title: 'For Sellers',
        description: 'Scale your business with powerful inventory management, real-time analytics, and global logistics support.',
        icon: <FiTrendingUp className="w-6 h-6" />,
        color: 'purple',
        links: [
            { label: 'Advanced Analytics', icon: <FiPieChart /> },
            { label: 'Brand Management', icon: <FiTrendingUp /> },
            { label: 'Bulk Operations', icon: <FiUsers /> }
        ]
    },
    {
        title: 'For Enterprise',
        description: 'Complete control over your marketplace with role-based access, automated moderation, and deep insights.',
        icon: <FiShield className="w-6 h-6" />,
        color: 'pink',
        links: [
            { label: 'Role Management', icon: <FiUsers /> },
            { label: 'Revenue Insights', icon: <FiPieChart /> },
            { label: 'Global Moderation', icon: <FiShield /> }
        ]
    }
];
