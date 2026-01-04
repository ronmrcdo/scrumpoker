import CallToAction from "@/components/landing/content/call-to-action";
import Features from "@/components/landing/content/features/features";
import Hero from "@/components/landing/content/hero/hero";
import LandingLayout from "@/components/layout/landing";

export default function Page() {
	console.log("test");
	return (
		<LandingLayout>
			<Hero />

			<Features />

			<CallToAction />
		</LandingLayout>
	);
}
