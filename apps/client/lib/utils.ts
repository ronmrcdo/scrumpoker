import type { TMember } from "@scrumpoker/shared-types";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getVoteStats = (members: TMember[]) => {
	const validVotes = members
		.map((m) => m.vote)
		.filter((vote): vote is string => !!vote && vote !== "☕")
		.map(Number)
		// biome-ignore lint/suspicious/noGlobalIsNan: Need to use isNaN for type safety
		.filter((n) => !isNaN(n));

	if (validVotes.length === 0) {
		return { avg: 0, min: 0, max: 0, highestMode: 0, consensus: false };
	}

	const sum = validVotes.reduce((a, b) => a + b, 0);
	const avg = (sum / validVotes.length).toFixed(1);
	const min = Math.min(...validVotes);
	const max = Math.max(...validVotes);
	const consensus = max - min <= 2;

	const counts = validVotes.reduce(
		(acc, vote) => {
			acc[vote] = (acc[vote] || 0) + 1;
			return acc;
		},
		{} as Record<number, number>,
	);

	const highestMode = Object.keys(counts).reduce((a, b) =>
		counts[Number(a)] > counts[Number(b)] ? a : b,
	);

	return { avg, min, max, highestMode: Number(highestMode), consensus };
};

export const getRadialPosition = (index: number, total: number) => {
	const angle = (index / total) * 2 * Math.PI;
	return {
		top: `${50 + 35 * Math.cos(angle)}%`,
		left: `${50 + 40 * Math.sin(angle)}%`,
		transform: "translate(-50%, -50%)",
	};
};
