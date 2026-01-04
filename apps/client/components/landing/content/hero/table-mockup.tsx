import { players, cards } from "@/constants";
import PokerCard from "./poker-card";

const TableMockup = () => (
	<div className="mt-24 w-full max-w-5xl relative group">
		<div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
		<div className="relative bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
			<div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/30">
				<div className="flex items-center gap-4">
					<div className="flex -space-x-2">
						{players.map((i) => (
							<div
								key={i}
								className={`w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold shadow-lg`}
							>
								P{i + 1}
							</div>
						))}
					</div>
					<span className="text-xs text-zinc-500 font-mono tracking-widest hidden sm:inline">
						{players.length} PLAYERS CONNECTED (P2P)
					</span>
				</div>
				<div className="px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold">
					LOBBY: AX79-22
				</div>
			</div>
			<div className="p-8 sm:p-12 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#1e1b4b_0%,transparent_70%)]">
				<div className="w-full max-w-md h-48 border-4 border-zinc-800 rounded-[100px] flex items-center justify-center relative mb-12">
					<div className="absolute inset-4 border border-zinc-700/50 rounded-[80px]" />
					<div className="text-zinc-500 font-mono text-sm uppercase tracking-[0.2em] text-center px-4">
						The Round Table
					</div>
					<div className="absolute -top-6 flex gap-2">
						<PokerCard className="bg-zinc-900 border-zinc-700 rotate-[-5deg] rounded-md text-indigo-400 border-b-indigo-500/30">
							8
						</PokerCard>
						<PokerCard className="bg-zinc-900 border-zinc-700 rotate-[5deg] rounded-md text-indigo-400 border-b-indigo-500/30">
							?
						</PokerCard>
					</div>
				</div>
				<div className="flex flex-wrap justify-center gap-3">
					{cards.map((num) => (
						<PokerCard
							key={num}
							className="bg-white text-black rounded-lg text-lg hover:-translate-y-2 transition-transform cursor-pointer shadow-lg active:scale-95"
						>
							{num}
						</PokerCard>
					))}
				</div>
			</div>
		</div>
	</div>
);

export default TableMockup;
