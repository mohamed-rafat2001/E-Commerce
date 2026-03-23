/* Pattern Summary:
Modeled after existing promotional sections in home feature and shared form controls.
This section follows the same typography and button language while keeping the newsletter
action disabled because no subscription endpoint exists in current API routes.
*/
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
			<div className="bg-gray-900 rounded-3xl px-6 md:px-12 py-12 md:py-16 text-center mx-auto max-w-2xl">
				<p className="text-xs uppercase tracking-[0.28em] text-blue-400 font-black">{label}</p>
				<h3 className="text-3xl md:text-4xl font-black text-white mt-4">{heading}</h3>
				<p className="text-gray-400 text-sm max-w-md mx-auto mt-4">{subtitle}</p>

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
							className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-5 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
						/>
						<Button
							type="submit"
							disabled={!hasNewsletterEndpoint || status === "loading"}
							title={!hasNewsletterEndpoint ? "Newsletter coming soon" : undefined}
							className="rounded-full px-7 py-3 !bg-white !text-gray-900 hover:!bg-gray-100 font-semibold"
						>
							{status === "loading" ? "Subscribing..." : "Subscribe"}
						</Button>
					</div>
				</form>

				{message && (
					<p className={`text-sm mt-4 ${status === "error" ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>
				)}
			</div>
		</section>
	);
}
