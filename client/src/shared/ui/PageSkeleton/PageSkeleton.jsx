/**
 * PageSkeleton — full-page loading placeholder shown while route chunks load.
 * Mimics the general layout of a typical e-commerce page (header + content grid)
 * to reduce perceived load time and prevent layout shift (CLS).
 */
export default function PageSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse transition-colors" aria-busy="true" aria-label="Loading page content">
			{/* Header skeleton */}
			<div className="h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700" />

			{/* Content area */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
				{/* Breadcrumb skeleton */}
				<div className="flex gap-2">
					<div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
				</div>

				{/* Hero/banner skeleton */}
				<div className="h-48 sm:h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />

				{/* Section title skeleton */}
				<div className="flex items-center justify-between">
					<div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
				</div>

				{/* Cards grid skeleton */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{[...Array(8)].map((_, i) => (
						<div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
							<div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
							<div className="p-4 space-y-3">
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
