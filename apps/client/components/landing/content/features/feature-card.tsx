import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

type TFeatureCardProps = {
	icon: IconSvgElement;
	iconClassName: string;
	title: string;
	description: string;
};
const FeatureCard = ({
	icon,
	iconClassName,
	title,
	description,
}: TFeatureCardProps) => (
	<div className="group p-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-zinc-800 transition-all duration-300 relative overflow-hidden text-left">
		<HugeiconsIcon
			icon={icon}
			size={120}
			className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity ${iconClassName}`}
		/>
		<div className="mb-6 p-3 w-fit rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 group-hover:scale-110 transition-all duration-500">
			<HugeiconsIcon icon={icon} size={24} className={iconClassName} />
		</div>
		<h3 className="text-xl font-semibold mb-3 text-zinc-200">{title}</h3>
		<p className="text-zinc-500 leading-relaxed text-sm">{description}</p>
	</div>
);

export default FeatureCard;
