import { SiteHeader } from "@/components/SiteHeader"
import { Hero } from "@/components/Hero"
import { ToolsSection } from "@/components/ToolsSection"
import { WhySection } from "@/components/WhySection"
import { DisclaimerSection } from "@/components/DisclaimerSection"
import { SiteFooter } from "@/components/SiteFooter"

export default function HomePage() {
	return (
		<>
			<SiteHeader />
			<main>
				<Hero />
				<ToolsSection />
				<WhySection />
				<DisclaimerSection />
			</main>
			<SiteFooter />
		</>
	)
}
