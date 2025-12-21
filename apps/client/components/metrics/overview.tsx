import Card from "../shared/card";

type TOverviewProps = {
	stats: {
		avg: string | number;
		min: number;
		max: number;
	};
};

function Overview({ stats }: TOverviewProps) {
	return (
		<Card className="p-6 bg-primary text-primary-foreground shadow-xl">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<p className="text-[10px] text-primary-foreground/70 font-bold uppercase">
						Average
					</p>
					<p className="text-3xl font-black">{stats.avg}</p>
				</div>
				<div>
					<p className="text-[10px] text-primary-foreground/70 font-bold uppercase">
						Spread
					</p>
					<p className="text-3xl font-black">
						{stats.min}-{stats.max}
					</p>
				</div>
			</div>
		</Card>
	);
}

export default Overview;
