import { ArrowRight01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import TableMockup from "./table-mockup";

const Hero = () => (
	<section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
		<div className="group relative inline-flex items-center gap-2 px-4 py-1 rounded-full border border-zinc-800 bg-zinc-950/50 text-xs text-zinc-400 mb-8 hover:border-zinc-700 transition-all cursor-pointer overflow-hidden">
			<span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
			No servers. No tracking. Just pointing.
			<HugeiconsIcon
				size={14}
				icon={ArrowRight01Icon}
				className="group-hover:translate-x-0.5 transition-transform"
			/>
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
		</div>

		<h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
			<span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-600">
				Scrum Poker. <br />
				All in on Peer-to-Peer.
			</span>
		</h1>

		<p className="max-w-2xl text-zinc-400 text-lg md:text-xl mb-12 leading-relaxed font-light">
			Host high-stakes planning sessions with a poker table twist. Connect
			directly to your team via WebRTC—no database, no signups, 100% free.
		</p>

		<div className="flex flex-col sm:flex-row items-center gap-4">
			<button
				type="button"
				className="group relative p-[1.5px] rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
			>
				<div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#818CF8_0%,#C084FC_50%,#818CF8_100%)] opacity-80" />
				<div className="relative flex items-center gap-2 px-8 py-3 rounded-full bg-[#050505] text-white font-medium group-hover:bg-[#0a0a0a] transition-colors">
					Create Private Table{" "}
					<HugeiconsIcon icon={ArrowRight02Icon} size={18} />
				</div>
			</button>

			<button
				type="button"
				className="flex items-center gap-2 px-8 py-3 rounded-full font-medium border border-zinc-800 hover:bg-zinc-900 transition-all"
			>
				Join with Code
			</button>
		</div>

		<TableMockup />
	</section>
);

export default Hero;
