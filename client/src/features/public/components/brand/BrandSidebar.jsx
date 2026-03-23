/* Pattern Summary:
Modeled after features/product/components/FiltersSidebar.jsx and header category navigation.
This component reuses the project's filter-list interaction style with active states,
URL-driven selection callbacks, and responsive desktop/mobile variants.
*/
import { useMemo } from "react";
import { FiGrid, FiLayers, FiStar } from "react-icons/fi";
import { Button } from "../../../../shared/ui/index.js";

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

	return (
		<>
			<div className="lg:hidden mb-8">
				<div className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] mb-3">Curated Selection</div>
				<div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
					{categoryGroups.map((category) => {
						const isActive = activeCategory === category.id || (!activeCategory && category.id === "");
						return (
							<button
								key={category.id || "all"}
								type="button"
								onClick={() => (category.id ? onCategorySelect(category.id) : onClearCategory())}
								className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap border transition-all ${
									isActive
										? "bg-blue-50 border-blue-200 text-blue-700"
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

			<aside className="hidden lg:block">
				<div className="sticky top-24">
					<div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Curated Selection</div>
					<h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mt-2 mb-6">Collections</h2>

					<nav role="list" className="space-y-2">
						{categoryGroups.map((category) => {
							const categoryIsActive = activeCategory === category.id || (!activeCategory && category.id === "");
							return (
								<div key={category.id || "all"} role="listitem">
									<button
										type="button"
										onClick={() => (category.id ? onCategorySelect(category.id) : onClearCategory())}
										className={`w-full text-left px-3 py-2 rounded-xl transition-all border flex items-center justify-between ${
											categoryIsActive
												? "bg-blue-50 border-blue-200 text-blue-700"
												: "bg-white border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
										}`}
										aria-current={categoryIsActive ? "true" : "false"}
									>
										<span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
											{category.id ? <FiLayers className="w-3.5 h-3.5" /> : <FiGrid className="w-3.5 h-3.5" />}
											{category.name}
										</span>
										{category.isNew && (
											<span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase">
												New
											</span>
										)}
									</button>

									{category.subItems.length > 0 && categoryIsActive && (
										<div className="ml-6 mt-2 space-y-1">
											{category.subItems.map((sub) => {
												const subIsActive = activeSubCategory === sub.id;
												return (
													<button
														key={sub.id}
														type="button"
														onClick={() => onSubCategorySelect(category.id, sub.id)}
														className={`w-full text-left text-[11px] font-bold tracking-wide rounded-lg px-2.5 py-2 transition-all ${
															subIsActive
																? "bg-blue-50 text-blue-700"
																: "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
														}`}
														aria-current={subIsActive ? "true" : "false"}
													>
														<span className="flex items-center justify-between">
															{sub.name}
															{sub.isNew && <FiStar className="w-3 h-3 text-blue-500" />}
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

					<Button
						variant="outline"
						size="sm"
						className="w-full mt-8 text-[10px] font-black uppercase tracking-[0.2em]"
						onClick={onClearCategory}
					>
						Browse Archives
					</Button>
				</div>
			</aside>
		</>
	);
}
