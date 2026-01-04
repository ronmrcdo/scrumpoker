"use client";

import { SquareLock02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { cards } from "@/constants";

const players = [
	{ id: 1, name: "You", vote: 8, status: "ready" },
	{ id: 2, name: "Sarah", vote: "?", status: "voting" },
	{ id: 3, name: "Mike", vote: 13, status: "ready" },
	{ id: 4, name: "Alex", vote: null, status: "idle" },
];

const PokerTable = () => {
	const [selectedCard, setSelectedCard] = useState<number | null>(null);

	return (
		<section className="flex-1 flex flex-col relative">
			<div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
				{/* Session Info */}
				<div className="text-center mb-12">
					<h1 className="text-xl font-medium text-zinc-300">
						Sprint 42: API Refactoring
					</h1>
					<p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-tighter">
						Waiting for all players to reveal
					</p>
				</div>

				{/* The Poker Table */}
				<div className="w-full max-w-2xl aspect-[2/1] border-4 border-zinc-800 rounded-[150px] relative flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#1e1b4b_0%,transparent_70%)] shadow-[0_0_50px_-12px_rgba(79,70,229,0.1)]">
					<div className="absolute inset-4 border border-zinc-700/30 rounded-[130px]" />

					{/* Voted Cards on Table */}
					<div className="flex gap-4 z-20">
						{players
							.filter((p) => p.vote !== null)
							.map((p) => (
								<div key={p.id} className="flex flex-col items-center gap-2">
									<div className="w-12 h-16 bg-zinc-900 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-400 font-bold shadow-2xl relative group cursor-help">
										{p.status === "ready" ? (
											<HugeiconsIcon size={16} icon={SquareLock02Icon} />
										) : (
											p.vote
										)}
									</div>
									<span className="text-[10px] text-zinc-500 font-medium">
										{p.name}
									</span>
								</div>
							))}
					</div>

					{/* Action Buttons on Table */}
					<div className="absolute bottom-8 flex gap-4">
						<button
							type="button"
							className="px-4 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-700 transition-colors"
						>
							Reset Table
						</button>
						<button
							type="button"
							className="px-4 py-1.5 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)]"
						>
							Reveal All
						</button>
					</div>
				</div>

				{/* Card Selector (Player's Hand) */}
				<div className="mt-16 w-full max-w-3xl">
					<div className="flex items-center justify-between mb-4">
						<span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
							Your Hand
						</span>
						<span className="text-xs text-indigo-400">
							Select a card to vote
						</span>
					</div>
					<div className="flex flex-wrap justify-center gap-3">
						{cards.map((num) => (
							<button
								key={num}
								type="button"
								onClick={() => setSelectedCard(num)}
								className={`w-12 h-16 sm:w-14 sm:h-20 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-300 ${
									selectedCard === num
										? "bg-indigo-600 text-white -translate-y-4 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.5)] scale-110"
										: "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:-translate-y-2"
								}`}
							>
								{num}
							</button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default PokerTable;
