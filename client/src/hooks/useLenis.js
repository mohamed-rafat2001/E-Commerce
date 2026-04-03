import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";

let exportedLenis = null;

export default function useLenis({ smooth = false } = {}) {
	const location = useLocation();
	const lenisRef = useRef(null);

	const scroller = useMemo(
		() => ({
			scrollTo: (target, options = {}) => {
				const top = typeof target === "number" ? target : 0;
				const immediate = options.immediate === true;
				window.scrollTo({
					top,
					left: 0,
					behavior: immediate ? "auto" : "smooth",
				});
			},
		}),
		[]
	);

	useEffect(() => {
		if (!smooth) return;
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		const lenis = new Lenis({
			duration: 1.15,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 0.8,
			touchMultiplier: 1.2,
		});

		lenisRef.current = lenis;
		const tick = (time) => lenis.raf(time * 1000);
		gsap.ticker.add(tick);
		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove(tick);
			lenis.destroy();
			lenisRef.current = null;
		};
	}, [smooth]);

	useEffect(() => {
		exportedLenis = lenisRef.current || scroller;
		return () => {
			exportedLenis = null;
		};
	}, [scroller, smooth]);

	useEffect(() => {
		if (lenisRef.current) {
			lenisRef.current.scrollTo(0, { immediate: true });
			return;
		}
		scroller.scrollTo(0, { immediate: true });
	}, [location.pathname, scroller, smooth]);

	return lenisRef.current || scroller;
}

export const getLenis = () => exportedLenis;
