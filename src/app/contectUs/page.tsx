import Hero from "@/components/contact/Hero";
import BoutiqueExperience from "@/components/contact/BoutiqueExperience";
import FAQ from "@/components/contact/FAQ";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Hero />

        <section className="contact-page-section">
          <ContactSection />
        </section>

        <BoutiqueExperience />

        <FAQ />
      </main>
      <Footer />
    </>
  );
}