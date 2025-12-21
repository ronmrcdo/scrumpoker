type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	className?: string;
};

const Input = ({ className = "", ...props }: InputProps) => (
	<input
		className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${className}`}
		{...props}
	/>
);

export default Input;
