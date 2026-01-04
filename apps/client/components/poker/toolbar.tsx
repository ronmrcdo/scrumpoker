import {
	EyeIcon,
	Logout01Icon,
	Rotate02Icon,
	ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import Badge from "../shared/badge";
import Button from "../shared/button";

type TToolbarProps = {
	code: string;
	isFacilitator: boolean;
	isRevealed: boolean;
	toggleReveal: () => void;
	leaveSession: () => void;
	nextStory: () => void;
};

function Toolbar({
	code,
	isFacilitator,
	isRevealed,
	toggleReveal,
	leaveSession,
	nextStory,
}: TToolbarProps) {
	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
			<div className="flex items-center gap-4">
				<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
					SP
				</div>
				<div>
					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className="font-mono text-[10px] uppercase"
						>
							{code}
						</Badge>
						{isFacilitator && (
							<Badge className="bg-blue-100 text-blue-700">Facilitator</Badge>
						)}
					</div>
					<h1 className="text-xl font-bold text-foreground mt-1">
						The current story
					</h1>
				</div>
			</div>

			<div className="flex items-center gap-2">
				{isFacilitator && (
					<>
						<Button variant="outline" onClick={nextStory}>
							<HugeiconsIcon icon={Rotate02Icon} className="w-4 h-4" />
							Reset
						</Button>
						<Button onClick={toggleReveal}>
							<HugeiconsIcon
								icon={isRevealed ? ViewOffSlashIcon : EyeIcon}
								className="w-4 h-4"
							/>
							{isRevealed ? "Hide" : "Reveal"}
						</Button>
					</>
				)}
				<Button variant="ghost" onClick={leaveSession}>
					<HugeiconsIcon icon={Logout01Icon} className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}

export default Toolbar;
