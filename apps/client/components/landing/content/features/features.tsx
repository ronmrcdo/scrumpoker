import { features } from "@/constants";
import FeatureCard from "./feature-card";

const Features = () => (
	<section className="py-24 px-6 max-w-7xl mx-auto">
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{features.map((feature) => (
				<FeatureCard key={feature.title} {...feature} />
			))}
		</div>
	</section>
);

export default Features;
