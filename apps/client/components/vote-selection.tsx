"use client";

import type { TMember } from "@scrumpoker/shared-types";

import Card from "./shared/card";

const CARD_VALUES = ["1", "2", "3", "5", "8", "13", "21", "☕"];

type TVoteSelectionProps = {
	currentUserId: string;
	members: TMember[];
	isRevealed: boolean;
	castVote: (value: string) => void;
};
function VoteSelection({
	currentUserId,
	members,
	isRevealed,
	castVote,
}: TVoteSelectionProps) {
	const currentVote = members.find((m) => m.id === currentUserId)?.vote;

	const getVoteClass = (val: string) =>
		currentVote === val
			? "bg-primary text-primary-foreground border-primary"
			: "bg-card text-foreground border-border";

	return (
		<Card className="p-6">
			<h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">
				Choose Value
			</h3>
			<div className="grid grid-cols-3 gap-2">
				{CARD_VALUES.map((val) => (
					<button
						key={val}
						type="button"
						disabled={isRevealed}
						onClick={() => castVote(val)}
						className={`h-14 rounded-lg border-2 cursor-pointer text-xl font-black transition-all ${getVoteClass(val)}`}
					>
						{val}
					</button>
				))}
			</div>
		</Card>
	);
}

export default VoteSelection;
