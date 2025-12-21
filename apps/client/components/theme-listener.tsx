"use client";

import { useEffect } from "react";

export function ThemeListener() {
	useEffect(() => {
		const root = document.documentElement;
		const media = window.matchMedia("(prefers-color-scheme: dark)");

		const updateTheme = (matches: boolean) => {
			if (matches) {
				root.classList.add("dark");
			} else {
				root.classList.remove("dark");
			}
		};

		updateTheme(media.matches);

		const listener = (e: MediaQueryListEvent) => updateTheme(e.matches);
		media.addEventListener("change", listener);

		return () => media.removeEventListener("change", listener);
	}, []);

	return null;
}
