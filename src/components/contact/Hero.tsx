import contactData from "@/data/contact.json";

export default function Hero() {
  const { hero } = contactData;

  return (
    <section className="contact-hero">
      <div className="contact-hero__inner">
        <h1 className="contact-hero__title">{hero.title}</h1>

        <p className="contact-hero__subtitle">
          {hero.subtitle}
        </p>
      </div>
    </section>
  );
}