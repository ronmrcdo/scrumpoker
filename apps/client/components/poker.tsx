"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { getVoteStats } from "@/lib/utils";
import { socketCommands } from "@/socket/commands";
import useBoundStore from "@/stores";

import Consensus from "./metrics/consensus";
import OverviewMetrics from "./metrics/overview";
import PokerCards from "./poker-cards";
import Card from "./shared/card";
import Toolbar from "./toolbar";
import VoteSelection from "./vote-selection";

function Poker() {
	const { id: currentUserId, roomData } = useBoundStore(
		useShallow((state) => ({
			id: state.id,
			roomData: state.room,
		})),
	);

	const isFacilitator = roomData?.facilitatorId === currentUserId;

	const stats = useMemo(
		() => getVoteStats(roomData?.members || []),
		[roomData?.members],
	);

	if (!roomData || !currentUserId) {
		return <div>Room not found</div>;
	}

	const toggleReveal = () => {
		if (!roomData.isRevealed) {
			socketCommands.reveal(roomData.code);
		} else {
			socketCommands.hide(roomData.code);
		}
	};

	const nextStory = () => {
		socketCommands.reset(roomData.code);
	};

	const leaveSession = () => {
		socketCommands.leave(roomData.code);
		useBoundStore.getState().clearRoom();
	};

	const castVote = (val: string) => {
		socketCommands.vote(roomData.code, val);
	};

	return (
		<div className="container mx-auto space-y-6">
			<Toolbar
				code={roomData.code}
				isFacilitator={isFacilitator}
				isRevealed={roomData?.isRevealed}
				toggleReveal={toggleReveal}
				leaveSession={leaveSession}
				nextStory={nextStory}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<Card className="lg:col-span-3 h-[600px] relative bg-[radial-gradient(hsl(var(--muted))_1px,transparent_1px)] dark:bg-[radial-gradient(hsl(var(--muted)/0.3)_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-56 rounded-full border-4 border-card bg-muted/50 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center">
						{roomData?.isRevealed ? (
							<Consensus
								stats={{
									highestMode: stats.highestMode,
									consensus: stats.consensus,
								}}
							/>
						) : (
							<span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest animate-pulse">
								Voting...
							</span>
						)}
					</div>

					<PokerCards roomData={roomData} currentUserId={currentUserId} />
				</Card>
				<div className="space-y-6">
					<VoteSelection
						currentUserId={currentUserId}
						members={roomData?.members || []}
						isRevealed={roomData?.isRevealed}
						castVote={castVote}
					/>

					{roomData?.isRevealed && (
						<OverviewMetrics
							stats={{ avg: stats.avg, min: stats.min, max: stats.max }}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default Poker;
