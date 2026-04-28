import aboutData from "@/data/about.json";

export default function Testimonial() {
  const t = aboutData.testimonial;

  return (
    <section className="about-section">
      <div className="about-testimonial">
        <p className="about-kicker about-testimonial__kicker">
          {t.label}
        </p>

        <blockquote className="about-testimonial__quote">
          "{t.quote}"
        </blockquote>

        <div className="about-testimonial__divider" />

        <h4 className="about-testimonial__author">
          {t.author}
        </h4>

        <p className="about-testimonial__role">{t.role}</p>
      </div>
    </section>
  );
}