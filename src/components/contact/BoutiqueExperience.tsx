import contactData from "@/data/contact.json";

export default function BoutiqueExperience() {
  const { boutique } = contactData;

  return (
    <section className="contact-section">
      <div className="contact-boutique">
        <div className="contact-boutique__media">
          <img
            src={boutique.image}
            className="contact-boutique__image"
            alt={boutique.imageAlt}
          />
        </div>

        <div className="contact-boutique__content">
          <h2 className="contact-section-title">{boutique.title}</h2>

          <p className="contact-body-text contact-boutique__description">
            {boutique.description}
          </p>

          <ul className="contact-highlight-list">
            {boutique.highlights.map((highlight) => (
              <li key={highlight} className="contact-highlight-list__item">
                <span className="contact-highlight-list__icon">
                  ✓
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}