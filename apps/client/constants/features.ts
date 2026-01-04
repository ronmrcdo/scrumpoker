import {
	Layout01Icon,
	LockIcon,
	RefreshIcon,
	SecurityCheckIcon,
	UserMultipleIcon,
	WifiOff01Icon,
} from "@hugeicons/core-free-icons";

export const features = [
	{
		icon: WifiOff01Icon,
		iconClassName: "text-indigo-400",
		title: "Serverless P2P",
		description:
			"Data travels directly between players. We don't host your estimates; your session stays entirely within your browsers via WebRTC.",
	},
	{
		icon: Layout01Icon,
		iconClassName: "text-purple-400",
		title: "Poker Table Logic",
		description:
			"Blinds, calls, and reveals. A gamified planning experience that keeps the team engaged and the scoring stakes crystal clear.",
	},
	{
		icon: LockIcon,
		iconClassName: "text-emerald-400",
		title: "E2E Encrypted",
		description:
			"Built-in privacy by design. Since there is no middleman server, your roadmap discussions and scores remain strictly confidential.",
	},
	{
		icon: UserMultipleIcon,
		iconClassName: "text-orange-400",
		title: "8 Players",
		description:
			"Scale your planning sessions without worrying about seat costs or subscription limits.",
	},
	{
		icon: RefreshIcon,
		iconClassName: "text-pink-400",
		title: "Instant Sync",
		description:
			"Ultra-low latency updates using WebRTC DataChannels. See votes the millisecond they are cast with no server hop.",
	},
	{
		icon: SecurityCheckIcon,
		iconClassName: "text-blue-400",
		title: "Truly Free",
		description:
			"No 'Pro' plans or credit cards. Our decentralized architecture means we have no server overhead to pass on to you.",
	},
];
