import aboutData from "@/data/about.json";

export default function StatsSection() {
  return (
    <section className="about-stats">
      <div className="about-stats__container">
        <div className="about-stats__grid">
          {aboutData.stats.map((stat) => (
            <div key={stat.label} className="about-stats__item">
              <h3 className="about-stats__number">{stat.number}</h3>

              <p className="about-stats__label">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}