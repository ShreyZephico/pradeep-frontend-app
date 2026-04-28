import aboutData from "@/data/about.json";

export default function BoutiqueExperience() {
  const b = aboutData.boutique;

  return (
    <section className="about-section">
      <div className="about-boutique">
        <div className="about-boutique__media">
          <img
            src={b.image}
            alt={b.title}
            className="about-boutique__image"
          />
        </div>

        <div className="about-boutique__content">
          <p className="about-kicker">
            {b.label}
          </p>

          <h2 className="about-section-title">{b.title}</h2>

          <p className="about-body-text about-boutique__description">
            {b.description}
          </p>

          <div className="about-boutique__highlights">
            {b.highlights?.map((highlight) => (
              <span key={highlight} className="about-pill">
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}