import aboutData from "@/data/about.json";

export default function CTASection() {
  const cta = aboutData.cta;

  return (
    <section className="about-cta">
      <div className="about-cta__background" />

      <div className="about-cta__content">
        <p className="about-kicker about-kicker--light">
          {cta.label}
        </p>

        <h2 className="about-cta__title">{cta.title}</h2>

        <p className="about-cta__description">
          {cta.description}
        </p>

        <div className="about-cta__actions">
          <button className="about-cta__button">
            {cta.button}
          </button>
        </div>
      </div>
    </section>
  );
}