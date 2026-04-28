import aboutData from "@/data/about.json";

export default function BrandStory() {
  const story = aboutData.brandStory;

  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-brand-story">
          <div className="about-brand-story__content">
            <p className="about-kicker">{story.label}</p>

            <h2 className="about-section-title">{story.title}</h2>

            <p className="about-body-text about-brand-story__description">
              {story.description}
            </p>

            <blockquote className="about-brand-story__quote">
              "{story.quote}"
            </blockquote>
          </div>

          <div className="about-brand-story__media">
            <div className="about-brand-story__image-frame">
              <img
                src={story.image}
                alt={story.imageAlt}
                className="about-brand-story__image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}