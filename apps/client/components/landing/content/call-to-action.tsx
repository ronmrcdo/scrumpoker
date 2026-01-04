import { Github01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const CallToAction = () => (
	<section className="py-24 border-t border-zinc-900 bg-gradient-to-b from-black to-[#0a0a0a]">
		<div className="max-w-3xl mx-auto text-center px-6">
			<h2 className="text-3xl md:text-5xl font-bold mb-6">
				Start your next sprint.
			</h2>
			<p className="text-zinc-500 mb-10 text-lg">
				Bring the excitement of the casino to your grooming sessions. Deal the
				cards and get pointing.
			</p>
			<button
				type="button"
				className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
			>
				Host a Table
			</button>
			<div className="mt-12 text-zinc-500 text-sm flex items-center justify-center gap-2">
				<HugeiconsIcon icon={Github01Icon} size={16} /> Open Source Project
			</div>
		</div>
	</section>
);

export default CallToAction;
