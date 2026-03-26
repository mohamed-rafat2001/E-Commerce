import { useMemo } from "react";
import { FiGrid, FiLayers, FiStar, FiInfo, FiCalendar, FiTag } from "react-icons/fi";

export default function BrandSidebar({
	brand,
	activeCategory,
	activeSubCategory,
	onCategorySelect,
	onSubCategorySelect,
	onClearCategory,
}) {
	const categoryGroups = useMemo(() => {
		const subCategories = Array.isArray(brand?.subCategories) ? brand.subCategories : [];
		const map = new Map();

		subCategories.forEach((sub) => {
			const parent = sub?.categoryId;
			const parentId = parent?._id || parent?.id;
			if (!parentId) return;

			if (!map.has(parentId)) {
				map.set(parentId, {
					id: parentId,
					name: parent?.name || "Collection",
					isNew: Boolean(parent?.isNew),
					subItems: [],
				});
			}

			map.get(parentId).subItems.push({
				id: sub?._id || sub?.id,
				name: sub?.name || "Sub Collection",
				isNew: Boolean(sub?.isNew),
			});
		});

		return [{ id: "", name: "All Collections", isNew: false, subItems: [] }, ...Array.from(map.values())];
	}, [brand]);

	const brandName = brand?.name || "Brand";
	const description = brand?.description || "";
	const categoryName = brand?.primaryCategory?.name || "";
	const memberSince = brand?.createdAt ? new Date(brand.createdAt).getFullYear() : "";

	return (
		<>
			{/* Mobile category pills */}
			<div className="lg:hidden mb-6">
				<div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Collections</div>
				<div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
					{categoryGroups.map((category) => {
						const isActive = activeCategory === category.id || (!activeCategory && category.id === "");
						return (
							<button
								key={category.id || "all"}
								type="button"
								onClick={() => (category.id ? onCategorySelect(category.id) : onClearCategory())}
								className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${isActive
									? "bg-gray-900 border-gray-900 text-white"
									: "bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300"
									}`}
								aria-current={isActive ? "true" : "false"}
							>
								{category.name}
							</button>
						);
					})}
				</div>
			</div>

			{/* Desktop sidebar */}
			<aside className="hidden lg:block">
				<div className="sticky top-24 space-y-6">
					{/* Collections navigation */}
					<div>
						<div className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Curated Selection</div>
						<h2 className="text-sm font-black text-gray-900 uppercase tracking-wider mt-1 mb-4">Collections</h2>

						<nav role="list" className="space-y-1">
							{categoryGroups.map((category) => {
								const categoryIsActive = activeCategory === category.id || (!activeCategory && category.id === "");
								return (
									<div key={category.id || "all"} role="listitem">
										<button
											type="button"
											onClick={() => (category.id ? onCategorySelect(category.id) : onClearCategory())}
											className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${categoryIsActive
												? "bg-gray-900 text-white shadow-sm"
												: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
												}`}
											aria-current={categoryIsActive ? "true" : "false"}
										>
											<span className="flex items-center gap-2 text-xs font-bold tracking-wide">
												{category.id ? (
													<FiLayers className={`w-3.5 h-3.5 ${categoryIsActive ? "text-white/70" : "text-gray-400 group-hover:text-gray-600"}`} />
												) : (
													<FiGrid className={`w-3.5 h-3.5 ${categoryIsActive ? "text-white/70" : "text-gray-400 group-hover:text-gray-600"}`} />
												)}
												{category.name}
											</span>
											{category.isNew && (
												<span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${categoryIsActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"
													}`}>
													New
												</span>
											)}
										</button>

										{category.subItems.length > 0 && categoryIsActive && (
											<div className="ml-5 mt-1 space-y-0.5 border-l-2 border-gray-200 pl-3">
												{category.subItems.map((sub) => {
													const subIsActive = activeSubCategory === sub.id;
													return (
														<button
															key={sub.id}
															type="button"
															onClick={() => onSubCategorySelect(category.id, sub.id)}
															className={`w-full text-left text-[11px] font-medium rounded-lg px-2.5 py-2 transition-all ${subIsActive
																? "bg-gray-100 text-gray-900 font-bold"
																: "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
																}`}
															aria-current={subIsActive ? "true" : "false"}
														>
															<span className="flex items-center justify-between">
																{sub.name}
																{sub.isNew && <FiStar className="w-3 h-3 text-indigo-500" />}
															</span>
														</button>
													);
												})}
											</div>
										)}
									</div>
								);
							})}
						</nav>
					</div>

					{/* Brand info card */}
					<div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
						<div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
							<FiInfo className="w-3 h-3" />
							Brand Info
						</div>
						<p className="text-xs text-gray-500 leading-relaxed">{description}</p>
						{categoryName && (
							<div className="flex items-center gap-2 text-xs text-gray-500">
								<FiTag className="w-3 h-3 text-gray-400" />
								<span className="font-medium text-gray-600">{categoryName}</span>
							</div>
						)}
						{memberSince && (
							<div className="flex items-center gap-2 text-xs text-gray-500">
								<FiCalendar className="w-3 h-3 text-gray-400" />
								<span>Member since <span className="font-medium text-gray-600">{memberSince}</span></span>
							</div>
						)}
					</div>

				</div>
			</aside>
		</>
	);
}
