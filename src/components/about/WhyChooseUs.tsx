import aboutData from "@/data/about.json";

export default function WhyChooseUs() {
  const section = aboutData.whyChooseUsSection;

  return (
    <section className="about-why-choose-us">
      <div className="about-container">
        <p className="about-kicker about-kicker--light">
          {section.label}
        </p>

        <h2 className="about-section-title about-section-title--light">{section.title}</h2>

        <div className="about-feature-grid">
          {aboutData.features.map((feature) => (
            <article key={feature.title} className="about-feature-card">
              <div className="about-feature-card__icon">{feature.icon}</div>

              <h3 className="about-feature-card__title">{feature.title}</h3>

              <p className="about-feature-card__description">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}