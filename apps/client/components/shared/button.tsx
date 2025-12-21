import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

const Button: FC<
	{
		children: ReactNode;
		variant?: "default" | "outline" | "secondary" | "ghost";
	} & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, variant = "default", className = "", ...props }) => {
	const variants = {
		default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
		outline:
			"border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground shadow-sm",
		secondary:
			"bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
		ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
	};
	return (
		<button
			className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 ${variants[variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
