import type { FC, ReactNode } from "react";

const Card: FC<{ children: ReactNode; className?: string }> = ({
	children,
	className = "",
}) => (
	<div
		className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className}`}
	>
		{children}
	</div>
);

export default Card;
