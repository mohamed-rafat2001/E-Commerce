import { useMemo, useState } from "react";
import { Button } from "../../../../shared/ui/index.js";

export default function BrandNewsletterSection({ brandId, brand }) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("idle");
	const [message, setMessage] = useState("");
	const hasNewsletterEndpoint = false;

	const label = useMemo(() => brand?.newsletterLabel || "NEWSLETTER", [brand?.newsletterLabel]);
	const heading = useMemo(() => brand?.newsletterTitle || "Join the Inner Circle", [brand?.newsletterTitle]);
	const subtitle = useMemo(
		() =>
			brand?.newsletterSubtitle ||
			"Sign up for curated releases, editorial stories, and first access to future collections.",
		[brand?.newsletterSubtitle]
	);

	const onSubmit = (event) => {
		event.preventDefault();
		const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		if (!isValidEmail) {
			setStatus("error");
			setMessage("Please enter a valid email address.");
			return;
		}
		if (!hasNewsletterEndpoint) {
			setStatus("error");
			setMessage("Newsletter coming soon.");
			return;
		}
		setStatus("loading");
		setStatus("idle");
		setMessage("");
	};

	return (
		<section className="mt-16">
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl px-6 md:px-12 py-12 md:py-16 text-center mx-auto max-w-2xl">
				<p className="text-[10px] uppercase tracking-[0.3em] text-indigo-500 font-bold">{label}</p>
				<h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-3">{heading}</h3>
				<p className="text-gray-500 text-sm max-w-md mx-auto mt-3">{subtitle}</p>

				<form onSubmit={onSubmit} className="mt-8">
					<label htmlFor={`brand-newsletter-email-${brandId}`} className="sr-only">
						Email address
					</label>
					<div className="flex flex-col sm:flex-row items-stretch gap-3">
						<input
							id={`brand-newsletter-email-${brandId}`}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email address"
							className="flex-1 bg-white border border-gray-200 rounded-full px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300"
						/>
						<Button
							type="submit"
							disabled={!hasNewsletterEndpoint || status === "loading"}
							title={!hasNewsletterEndpoint ? "Newsletter coming soon" : undefined}
							className="rounded-full px-7 py-3 !bg-gray-900 !text-white hover:!bg-gray-800 font-semibold"
						>
							{status === "loading" ? "Subscribing..." : "Subscribe"}
						</Button>
					</div>
				</form>

				{message && (
					<p className={`text-sm mt-4 ${status === "error" ? "text-rose-500" : "text-emerald-600"}`}>{message}</p>
				)}
			</div>
		</section>
	);
}
