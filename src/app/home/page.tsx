import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import LegacySection from '@/components/home/LegacySection';
import CollectionsSection from '@/components/home/CollectionsSection';
import CuratedSection from '@/components/home/CuratedSection';
import BespokeSection from '@/components/home/BespokeSection';
import GiftingSection from '@/components/home/GiftingSection';
import PricingSection from '@/components/home/PricingSection';
import GoldSchemeSection from '@/components/home/GoldSchemeSection';
import LearnSection from '@/components/home/LearnSection';
import FounderSection from '@/components/home/FounderSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import SocialSection from '@/components/home/SocialSection';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
       <LegacySection />
      <CollectionsSection />
      <CuratedSection />
      <BespokeSection />
      <GiftingSection />
      <PricingSection />
      <GoldSchemeSection />
      <LearnSection />
      <FounderSection />
      <TestimonialsSection />
      <SocialSection />
      <Footer /> 
    </main>
  );
}