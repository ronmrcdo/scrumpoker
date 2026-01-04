const Footer = () => (
	<footer className="py-12 px-6 border-t border-zinc-900 text-center text-zinc-600 text-sm">
		<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
			<p>&copy; 2025 Stacks P2P.</p>
			<div className="flex gap-6">
				<p>
					Made with ❤️ by{" "}
					<a
						href="https://ronmrcdo.dev"
						className="hover:text-white transition-colors"
					>
						Ron
					</a>
				</p>
			</div>
		</div>
	</footer>
);

export default Footer;
