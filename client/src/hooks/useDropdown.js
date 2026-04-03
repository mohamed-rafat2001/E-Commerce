import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDropdown — manages dropdown open/close state with body scroll locking,
 * outside-click dismissal, Escape key handling, and cleanup.
 *
 * @returns {{ open: boolean, ref: React.RefObject, openDropdown: () => void, closeDropdown: () => void, toggleDropdown: () => void }}
 */
export function useDropdown() {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	const openDropdown = useCallback(() => {
		setOpen(true);
		document.body.style.overflow = 'hidden';
	}, []);

	const closeDropdown = useCallback(() => {
		setOpen(false);
		document.body.style.overflow = '';
	}, []);

	const toggleDropdown = useCallback(() => {
		if (open) {
			closeDropdown();
		} else {
			openDropdown();
		}
	}, [open, openDropdown, closeDropdown]);

	// Close on outside click
	useEffect(() => {
		if (!open) return;

		const handleClick = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				closeDropdown();
			}
		};

		document.addEventListener('mousedown', handleClick);
		document.addEventListener('touchstart', handleClick);

		return () => {
			document.removeEventListener('mousedown', handleClick);
			document.removeEventListener('touchstart', handleClick);
		};
	}, [open, closeDropdown]);

	// Close on Escape
	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') closeDropdown();
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [open, closeDropdown]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	return { open, ref, openDropdown, closeDropdown, toggleDropdown };
}

export default useDropdown;
