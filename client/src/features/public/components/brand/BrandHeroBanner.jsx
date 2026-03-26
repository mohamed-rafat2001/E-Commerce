import { useMemo } from "react";
import { FiCheck, FiShare2, FiStar, FiClock, FiUsers, FiPackage, FiPlus } from "react-icons/fi";
import { Button } from "../../../../shared/ui/index.js";

const formatCompactNumber = (value) => {
	const numericValue = Number(value || 0);
	if (!Number.isFinite(numericValue)) return "0";
	return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(numericValue);
};

export default function BrandHeroBanner({
	brand,
	isAuthenticated,
	onFollowAction,
	isFollowing,
	followersCount,
	isToggling,
	productsCount,
}) {
	const coverImage = brand?.coverImage?.secure_url || brand?.coverImage?.url || brand?.coverImage;
	const logoImage = brand?.logo?.secure_url || brand?.logo?.url || brand?.logo;
	const brandName = brand?.name || "Brand";
	const followersValue = useMemo(() => formatCompactNumber(followersCount), [followersCount]);
	const categoryName = brand?.primaryCategory?.name || "General";
	const ratingAvg = brand?.ratingAverage || 0;
	const ratingCountVal = brand?.ratingCount || 0;
	const memberSince = brand?.createdAt ? new Date(brand.createdAt).getFullYear() : new Date().getFullYear();

	const handleShare = async () => {
		try {
			await navigator.share?.({
				title: brandName,
				url: window.location.href,
			});
		} catch {
			navigator.clipboard?.writeText(window.location.href);
		}
	};

	return (
		<div className="mb-10">
			{/* Cover Image */}
			<div
				className="relative rounded-2xl overflow-hidden h-[260px] md:h-[320px] bg-gradient-to-br from-slate-100 to-slate-200"
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
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

				{/* Watermark text */}
				<div className="absolute inset-0 pointer-events-none flex items-center justify-center">
					<span className="text-white/[0.07] text-[80px] md:text-[140px] font-black tracking-tight uppercase select-none leading-none">
						{brandName}
					</span>
				</div>

				{/* Bottom info overlay */}
				<div className="absolute bottom-0 left-0 right-0 px-5 md:px-8 pb-6 z-10">
					<div className="flex items-end justify-between gap-4">
						<div className="flex items-end gap-4">
							{/* Logo */}
							<div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-[3px] border-white bg-white shrink-0 shadow-lg">
								{logoImage ? (
									<img
										src={logoImage}
										alt={`${brandName} logo`}
										className="w-full h-full object-cover"
										crossOrigin="anonymous"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-black">
										{brandName.slice(0, 2).toUpperCase()}
									</div>
								)}
							</div>

							{/* Name + meta */}
							<div>
								<h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{brandName}</h1>
								<div className="mt-1 flex items-center gap-3 text-white/80 text-sm">
									<span className="inline-flex items-center gap-1">
										<FiUsers className="w-3.5 h-3.5" />
										{followersValue} followers
									</span>
									<span className="w-1 h-1 rounded-full bg-white/50" />
									<span>{categoryName}</span>
									{brand?.isVerified !== false && (
										<>
											<span className="w-1 h-1 rounded-full bg-white/50" />
											<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
												<FiCheck className="w-3 h-3" /> Verified
											</span>
										</>
									)}
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-2 shrink-0">
							<button
								type="button"
								onClick={handleShare}
								className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/40 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
							>
								<FiShare2 className="w-3.5 h-3.5" />
								Share
							</button>
							<button
								type="button"
								onClick={onFollowAction}
								disabled={isToggling}
								className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isFollowing
										? "bg-white/20 text-white border border-white/40 hover:bg-white/30"
										: "bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
									}`}
								aria-label={isFollowing ? `Unfollow ${brandName}` : `Follow ${brandName}`}
								aria-pressed={isFollowing}
							>
								{isFollowing ? (
									<>
										<FiCheck className="w-3.5 h-3.5" />
										Following
									</>
								) : (
									<>
										<FiPlus className="w-3.5 h-3.5" />
										Follow
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Strip */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
				{[
					{
						icon: FiPackage,
						label: "Products",
						value: productsCount || brand?.products?.length || 0,
						sub: `in ${brand?.subCategories?.length || 1} collections`,
					},
					{
						icon: FiUsers,
						label: "Followers",
						value: followersValue,
						sub: followersCount === 0 ? "be the first!" : "and growing",
					},
					{
						icon: FiStar,
						label: "Avg. Rating",
						value: ratingAvg > 0 ? ratingAvg.toFixed(1) : "—",
						sub: ratingCountVal > 0 ? `across ${ratingCountVal} reviews` : "no reviews yet",
						hasIcon: ratingAvg > 0,
					},
					{
						icon: FiClock,
						label: "Member Since",
						value: memberSince,
						sub: "on the platform",
					},
				].map((stat) => (
					<div
						key={stat.label}
						className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all"
					>
						<div className="flex items-center gap-1.5 mb-2">
							<stat.icon className="w-3.5 h-3.5 text-gray-400" />
							<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
						</div>
						<div className="flex items-baseline gap-1.5">
							<span className="text-2xl font-black text-gray-900">{stat.value}</span>
							{stat.hasIcon && <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />}
						</div>
						<span className="text-xs text-gray-400 mt-0.5 block">{stat.sub}</span>
					</div>
				))}
			</div>
		</div>
	);
}
