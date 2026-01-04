"use client";

import { DiceFaces05Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
				isScrolled
					? "bg-black/80 backdrop-blur-md border-zinc-800/50 py-3"
					: "bg-transparent border-transparent py-5"
			}`}
		>
			<div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
				<div className="flex items-center gap-8">
					<div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
						<div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
							<HugeiconsIcon
								icon={DiceFaces05Icon}
								className="text-white w-5 h-5"
							/>
						</div>
						<span>STACKS</span>
					</div>
					<div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
						<a href="#" className="hover:text-white transition-colors">
							How it Works
						</a>
						<a href="#" className="hover:text-white transition-colors">
							P2P Security
						</a>
						<a href="#" className="hover:text-white transition-colors">
							Community
						</a>
					</div>
				</div>
				<div className="flex items-center gap-4">
					<button
						type="button"
						className="px-4 py-1.5 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-200 transition-colors"
					>
						Buy me a coffee
					</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
