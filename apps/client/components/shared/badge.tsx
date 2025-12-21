import type { FC, ReactNode } from "react";

const Badge: FC<{
	children: ReactNode;
	variant?: "default" | "secondary" | "outline" | "success";
	className?: string;
}> = ({ children, variant = "default", className = "" }) => {
	const variants = {
		default: "bg-primary text-primary-foreground border-transparent",
		secondary: "bg-secondary text-secondary-foreground border-transparent",
		outline: "text-foreground border-border",
		success:
			"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-transparent",
	};
	return (
		<span
			className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
		>
			{children}
		</span>
	);
};

export default Badge;
