import BestSellerSection from "@/components/landing/BestSellerSection";
import ContactSection from "@/components/landing/ContactSection";
import CraftsmanshipSection from "@/components/landing/CraftsmanshipSection";
import CTASection from "@/components/landing/CTASection";
import FAQSection from "@/components/landing/FAQSection";
import FeaturedCollectionSection from "@/components/landing/FeaturedCollectionSection";
import Footer from "@/components/landing/Footer";
import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/landing/Navbar";
import OfferBannerSection from "@/components/landing/OfferBannerSection";
import ShopByCategorySection from "@/components/landing/ShopByCategorySection";
import TestimonialSection from "@/components/landing/TestimonialSection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ShopByCategorySection />
        <FeaturedCollectionSection />
        <BestSellerSection />
        <CraftsmanshipSection />
        <TestimonialSection />
        <OfferBannerSection />
        <FAQSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
