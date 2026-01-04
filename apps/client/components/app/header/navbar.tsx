"use client";

import {
	AlertCircleIcon,
	ChatBlockedIcon,
	ChatIcon,
	Logout04Icon,
	Wifi01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useShallow } from "zustand/shallow";
import useBoundStore from "@/stores";

const Navbar = () => {
	const { isChatOpen, toggleChat } = useBoundStore(
		useShallow((state) => ({
			isChatOpen: state.isChatOpen,
			toggleChat: state.toggleChat,
		})),
	);

	return (
		<header className="relative z-10 border-b border-zinc-800 bg-black/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 font-bold tracking-tighter">
					<div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
						<span className="text-[10px] text-white">S</span>
					</div>
					<span className="text-sm">STACKS / ROOM-AX79</span>
				</div>
				<div className="h-4 w-[1px] bg-zinc-800" />
				<div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 font-mono">
					<HugeiconsIcon size={12} icon={Wifi01Icon} /> P2P SECURE
				</div>
			</div>
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={toggleChat}
					className="p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
				>
					<HugeiconsIcon
						size={18}
						icon={isChatOpen ? ChatIcon : ChatBlockedIcon}
					/>
				</button>

				<button
					type="button"
					className="hidden sm:flex p-2 text-zinc-400 hover:text-white transition-colors"
				>
					<HugeiconsIcon size={18} icon={AlertCircleIcon} />
				</button>

				<button
					type="button"
					className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-zinc-800 rounded-lg hover:bg-zinc-900 transition-all text-zinc-300"
				>
					<HugeiconsIcon size={14} icon={Logout04Icon} /> Leave
				</button>
			</div>
		</header>
	);
};

export default Navbar;
