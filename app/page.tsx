import Navbar from "@/components/navbar-section"
import FullHeroPage from "@/components/hero-section"
import StatsSection from "@/components/stats-section"
import TestimonialSection from "@/components/testimonial-section"
import PricingSection from "@/components/pricing-section"
import FaqsSection from "@/components/faq-section"
import Cta2Section from "@/components/cta-section"
import Footer from "@/components/footer-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: "url('')" }}>
      <Navbar />
      <main className="min-h-screen pt-24">
        <FullHeroPage />
        <StatsSection />
        <TestimonialSection />
        <PricingSection />
        <FaqsSection />
        <Cta2Section />
        <Footer />
      </main>
    </div>
  )
}