"use client";
import {
	Cancel01Icon,
	Message01Icon,
	SentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useShallow } from "zustand/shallow";
import useBoundStore from "@/stores";
import { useState } from "react";

const ChatList = () => {
	const {
		isChatOpen,
		toggleChat,
		chatMessages,
		sendChatMessage,
		clientId,
		name,
	} = useBoundStore(
		useShallow((state) => ({
			isChatOpen: state.isChatOpen,
			toggleChat: state.toggleChat,
			chatMessages: state.chatMessages,
			sendChatMessage: state.sendChatMessage,
			clientId: state.clientId,
			name: state.name,
		})),
	);
	const [message, setMessage] = useState("");

	const handleSend = () => {
		if (message.trim()) {
			sendChatMessage(message, { id: clientId, name: name || "Anonymous" });
			setMessage("");
		}
	};

	return (
		<aside
			className={`fixed lg:relative top-0 right-0 h-full lg:h-auto z-40 w-80 border-l border-zinc-800 bg-black transition-all duration-300 flex flex-col ${
				isChatOpen ? "translate-x-0" : "translate-x-full -mr-80"
			}`}
		>
			<div className="p-6 border-b border-zinc-800 flex items-center justify-between">
				<h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
					<HugeiconsIcon size={14} icon={Message01Icon} /> Room Chat
				</h2>
				<button type="button" onClick={toggleChat} className="text-zinc-500">
					<HugeiconsIcon size={18} icon={Cancel01Icon} />
				</button>
			</div>
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{chatMessages.map((msg, index) => (
					<div
						key={msg.id || index}
						className={`flex flex-col gap-1 ${msg.senderName === "You" ? "items-end" : "items-start"}`}
					>
						<span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tight">
							{msg.senderName}{" "}
							{msg.timestamp && (
								<span className="text-zinc-600 font-normal ml-1">
									{msg.timestamp}
								</span>
							)}
						</span>
						<div
							className={`p-3 max-w-[90%] text-sm rounded-2xl border ${
								msg.type === "System"
									? "bg-zinc-900/20 border-zinc-800 text-zinc-500 italic text-center w-full"
									: msg.senderName === "You"
										? "bg-indigo-600/10 border-indigo-500/20 text-indigo-100 rounded-tr-none"
										: "bg-zinc-900/50 border-zinc-800/50 text-zinc-300 rounded-tl-none"
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}
			</div>
			<div className="p-4 bg-zinc-950 border-t border-zinc-800">
				<div className="relative">
					<input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message..."
						className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors pr-10"
					/>
					<button
						type="button"
						onClick={handleSend}
						className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-500 hover:text-indigo-400 transition-colors"
					>
						<HugeiconsIcon size={16} icon={SentIcon} />
					</button>
				</div>
				<p className="text-[10px] text-zinc-600 mt-3 text-center">
					Messages are sent directly via P2P.
				</p>
			</div>
		</aside>
	);
};

export default ChatList;
