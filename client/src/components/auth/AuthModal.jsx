/* Audit Findings:
 - App already uses react-hot-toast and role-aware routing.
 - Guest actions currently redirect in some places; modal prompt is needed to avoid mid-action redirects.
 - Login flow supports query params and can consume redirect target after successful auth.
*/
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { closeAuthModal, resetAuthModal } from "../../app/store/slices/authModalSlice.js";

const FOCUSABLE = [
	'button:not([disabled])',
	'a[href]',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(",");

export default function AuthModal() {
	const { isOpen, message, redirectAfter } = useSelector((state) => state.authModalStore);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const panelRef = useRef(null);

	const portalRoot = useMemo(() => {
		if (typeof document === "undefined") return null;
		return document.body;
	}, []);

	useEffect(() => {
		if (!isOpen || !panelRef.current) return undefined;

		const focusables = panelRef.current.querySelectorAll(FOCUSABLE);
		const first = focusables[0];
		const last = focusables[focusables.length - 1];
		if (first) first.focus();

		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				dispatch(closeAuthModal());
				return;
			}

			if (e.key !== "Tab" || !focusables.length) return;
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [dispatch, isOpen]);

	if (!isOpen || !portalRoot) return null;

	const close = () => dispatch(resetAuthModal());
	const redirectValue = redirectAfter || "/";

	const goToLogin = () => {
		dispatch(closeAuthModal());
		window.location.assign(`/login?redirect=${encodeURIComponent(redirectValue)}`);
	};

	const goToRegister = () => {
		dispatch(closeAuthModal());
		window.location.assign(`/register?redirect=${encodeURIComponent(redirectValue)}`);
	};
    
    const continueAsGuest = () => {
        dispatch(closeAuthModal());
        navigate(redirectValue);
    };

	return ReactDOM.createPortal(
		<div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
			<button
				aria-label="Close auth modal"
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={close}
			/>

			<div
				ref={panelRef}
				role="dialog"
				aria-modal="true"
				aria-label="Authentication Required"
				className="relative z-10 w-full max-w-md rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-2xl"
			>
				<button
					onClick={close}
					className="absolute right-4 top-4 h-9 w-9 rounded-full border border-gray-100 dark:border-gray-800 text-gray-500 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
					aria-label="Close"
				>
					<FiX className="mx-auto h-4 w-4" />
				</button>

				<div className="mb-6 flex items-center justify-center">
					<span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">ShopyNow</span>
				</div>

				<p className="mb-8 text-center text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
					{message || "Sign in to continue"}
				</p>

				<div className="grid grid-cols-2 gap-3">
					<button
						onClick={goToLogin}
						className="rounded-2xl bg-gray-900 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-black"
					>
						Sign In
					</button>
					<button
						onClick={goToRegister}
						className="rounded-2xl border-2 border-gray-100 dark:border-gray-800 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
					>
						Create Account
					</button>
				</div>

                {redirectValue === '/checkout' && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <button
                            onClick={continueAsGuest}
                            className="w-full py-3 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            Complete without login (Guest)
                        </button>
                    </div>
                )}
			</div>
		</div>,
		portalRoot
	);
}
