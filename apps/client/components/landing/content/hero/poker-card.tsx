"use client";

const PokerCard: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({ children, className }) => (
	<div
		className={`w-10 h-14 border flex items-center justify-center font-bold shadow-xl border-b-2 ${className}`}
	>
		{children}
	</div>
);

export default PokerCard;
