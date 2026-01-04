"use client";

import { getRadialPosition } from "@/lib/utils";
import type { TRoomSerialize } from "@/stores/room.slice";

type TPokerCardsProps = {
	roomData: TRoomSerialize;
	currentUserId: string;
};
function PokerCards({ roomData, currentUserId }: TPokerCardsProps) {
	const membersCount = roomData.members?.length;

	return roomData.members?.map((member, index) => {
		const position = getRadialPosition(index, membersCount);
		const hasVoted = !!member.vote;
		const isMe = member.id === currentUserId;

		return (
			<div
				key={member.id}
				style={position}
				className="absolute flex flex-col items-center gap-2"
			>
				<div
					className={`w-16 h-24 rounded-xl border-2 flex items-center justify-center text-2xl font-black shadow-lg transition-all
          ${
						hasVoted
							? roomData.isRevealed
								? "bg-card border-primary text-foreground scale-110"
								: "bg-primary border-primary text-primary-foreground"
							: "bg-muted border-border border-dashed text-muted-foreground"
					}`}
				>
					{roomData.isRevealed
						? member.vote
						: hasVoted
							? isMe
								? member.vote
								: "✓"
							: "?"}
				</div>
				<span
					className={`text-[10px] font-bold uppercase truncate w-20 text-center ${isMe ? "text-foreground" : "text-muted-foreground"}`}
				>
					{member.name}
				</span>
			</div>
		);
	});
}

export default PokerCards;
