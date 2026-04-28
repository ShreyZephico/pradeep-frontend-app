import aboutData from "@/data/about.json";

export default function MissionVision() {
  const { missionVision } = aboutData;

  return (
    <section className="about-mission-vision">
      <div className="about-container">
        <div className="about-mission-vision__grid">
          <div className="about-mission-vision__item">
            <p className="about-kicker about-kicker--light">
              {missionVision.missionLabel}
            </p>
            <p className="about-mission-vision__text">
              {missionVision.missionText}
            </p>
          </div>

          <div className="about-mission-vision__item">
            <p className="about-kicker about-kicker--light">
              {missionVision.visionLabel}
            </p>
            <p className="about-mission-vision__text">
              {missionVision.visionText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
