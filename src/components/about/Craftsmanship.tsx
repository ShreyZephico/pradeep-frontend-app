import aboutData from "@/data/about.json";

export default function Craftsmanship() {
  const section = aboutData.craftsmanshipSection;

  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-section-header">
          <p className="about-kicker">
            {section.label}
          </p>

          <h2 className="about-section-title about-section-title--center">
            {section.title}
          </h2>
        </div>

        <div className="about-craftsmanship-grid">
          {aboutData.craftsmanship.map((item) => (
            <article key={item.title} className="about-card about-card--craft">
              <div className="about-card__media">
                <img
                  src={item.image}
                  alt={item.title}
                  className="about-card__image about-card__image--craft"
                />
                <div className="about-card__overlay" />
              </div>

              <div className="about-card__body">
                <h3 className="about-card__title">{item.title}</h3>
                <p className="about-card__description">{section.cardDescription}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}