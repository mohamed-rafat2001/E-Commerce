/* Pattern Summary:
Modeled after features/product/pages/ProductDetailPage.jsx hero treatment and existing auth-guard usage.
It keeps the page's visual language for premium banners while integrating auth-aware follow interactions
and resilient rendering for missing API fields.
*/
import { useMemo } from "react";
import { FiCheck, FiMapPin, FiUsers } from "react-icons/fi";
import { Button } from "../../../../shared/ui/index.js";

const formatCompactNumber = (value) => {
	const numericValue = Number(value || 0);
	if (!Number.isFinite(numericValue)) return "0";
	return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(numericValue);
};

export default function BrandHeroBanner({ brand, isAuthenticated, onFollowAction, followUnavailable }) {
	const coverImage = brand?.coverImage?.secure_url || brand?.coverImage?.url || brand?.coverImage;
	const logoImage = brand?.logo?.secure_url || brand?.logo?.url || brand?.logo;
	const brandName = brand?.name || "Brand";
	const isFollowed = Boolean(brand?.isFollowed);
	const followersValue = useMemo(
		() => formatCompactNumber(brand?.followersCount ?? brand?.ratingCount ?? 0),
		[brand?.followersCount, brand?.ratingCount]
	);
	const locationValue = brand?.location || brand?.primaryCategory?.name || "Global";

	return (
		<div
			className="relative rounded-3xl overflow-hidden min-h-[360px] bg-gray-900 mb-10"
			role="img"
			aria-label={`${brandName} cover`}
		>
			{coverImage && (
				<img
					src={coverImage}
					alt={`${brandName} cover`}
					className="absolute inset-0 w-full h-full object-cover"
					crossOrigin="anonymous"
				/>
			)}
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

			<div className="absolute inset-0 pointer-events-none flex items-center justify-center">
				<span className="text-white/10 text-[80px] md:text-[140px] font-black tracking-tight uppercase select-none">
					{brandName}
				</span>
			</div>

			<div className="absolute top-6 right-6 z-10">
				<Button
					onClick={onFollowAction}
					title={followUnavailable && isAuthenticated ? "Follow coming soon" : undefined}
					disabled={followUnavailable && isAuthenticated}
					className={
						isFollowed
							? "px-6 py-2 rounded-full !bg-transparent !text-white border border-white/60 hover:!bg-white/10"
							: "px-6 py-2 rounded-full !bg-white !text-gray-900 hover:!bg-gray-100"
					}
					aria-label={`Follow ${brandName}`}
					aria-pressed={isFollowed}
				>
					<span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest">
						{isFollowed && <FiCheck className="w-3.5 h-3.5" />}
						{isFollowed ? "Following" : "Follow"}
					</span>
				</Button>
			</div>

			<div className="absolute bottom-0 left-0 right-0 px-6 md:px-8 pb-8 z-10">
				<div className="flex items-end gap-4">
					<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-white shrink-0">
						{logoImage ? (
							<img
								src={logoImage}
								alt={`${brandName} logo`}
								className="w-full h-full object-cover"
								crossOrigin="anonymous"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
								{brandName.slice(0, 2)}
							</div>
						)}
					</div>

					<div>
						<h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{brandName}</h1>
						<div className="mt-1 flex items-center gap-3 text-white/80 text-sm">
							<span className="inline-flex items-center gap-1">
								<FiUsers className="w-4 h-4" />
								{followersValue} Followers
							</span>
							<span className="w-1 h-1 rounded-full bg-white/70" />
							<span className="inline-flex items-center gap-1">
								<FiMapPin className="w-4 h-4" />
								{locationValue}
							</span>
						</div>
						{brand?.tagline && <p className="text-white/80 text-sm mt-2 font-medium">{brand.tagline}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
