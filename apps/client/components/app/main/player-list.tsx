import { UserMultipleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const players = [
	{ id: 1, name: "You", vote: 8, status: "ready" },
	{ id: 2, name: "Sarah", vote: "?", status: "voting" },
	{ id: 3, name: "Mike", vote: 13, status: "ready" },
	{ id: 4, name: "Alex", vote: null, status: "idle" },
];

const PlayerList = () => (
	<aside className="w-64 border-r border-zinc-800 hidden lg:flex flex-col bg-black/20">
		<div className="p-6 border-b border-zinc-800 flex items-center justify-between">
			<h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
				<HugeiconsIcon size={14} icon={UserMultipleIcon} /> Players
			</h2>
			<span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
				4
			</span>
		</div>
		<div className="flex-1 overflow-y-auto p-4 space-y-2">
			{players.map((player) => (
				<div
					key={player.id}
					className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-zinc-800 hover:bg-zinc-900/50 transition-all"
				>
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold">
							{player.name[0]}
						</div>
						<div className="flex flex-col">
							<span className="text-sm font-medium">{player.name}</span>
							<span
								className={`text-[10px] ${player.status === "ready" ? "text-emerald-500" : "text-zinc-500"}`}
							>
								{player.status === "ready" ? "Ready" : "Thinking..."}
							</span>
						</div>
					</div>
					{player.vote && (
						<div className="w-6 h-8 bg-zinc-800 rounded flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/20">
							{player.status === "ready" ? "✓" : ""}
						</div>
					)}
				</div>
			))}
		</div>
	</aside>
);

export default PlayerList;
