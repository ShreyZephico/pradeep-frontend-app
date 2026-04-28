import aboutData from "@/data/about.json";

export default function Hero() {
  const { hero } = aboutData;

  return (
    <section className="about-hero">
      <div className="about-hero__inner">
        <p className="about-hero__eyebrow">{hero.eyebrow}</p>

        <h1 className="about-hero__title">{hero.title}</h1>

        <p className="about-hero__subtitle">{hero.subtitle}</p>
      </div>
    </section>
  );
}