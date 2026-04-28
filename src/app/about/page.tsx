import Hero from "@/components/about/Hero";
import BrandStory from "@/components/about/BrandStory";
import MissionVision from "@/components/about/MissionVision";
import Craftsmanship from "@/components/about/Craftsmanship";
import StatsSection from "@/components/about/StatsSextion";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import Testimonial from "@/components/about/Testimonial";
import BoutiqueExperience from "@/components/about/BoutiqueExperience";
import CTASection from "@/components/about/CTASection";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Hero />
        <BrandStory />
        <MissionVision />
        <Craftsmanship />
        <StatsSection />
        <WhyChooseUs />
        <Testimonial />
        <BoutiqueExperience />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}