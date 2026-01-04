import Badge from "../../shared/badge";

type TConsensusProps = {
	stats: {
		highestMode: number;
		consensus: boolean;
	};
};

function Consensus({ stats }: TConsensusProps) {
	return (
		<div className="animate-in fade-in zoom-in duration-300">
			<span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 block">
				Mode
			</span>
			<div className="text-6xl font-black text-foreground">
				{stats.highestMode}
			</div>
			<Badge
				variant={stats.consensus ? "success" : "secondary"}
				className="mt-2"
			>
				{stats.consensus ? "Consensus" : "Mixed"}
			</Badge>
		</div>
	);
}

export default Consensus;
