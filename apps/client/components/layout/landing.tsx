import Footer from "@/components/landing/footer/footer";
import Header from "@/components/landing/header/header";

const LandingLayout: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => (
	<>
		<Header />

		<main className="relative z-10">{children}</main>
		<Footer />
	</>
);

export default LandingLayout;
