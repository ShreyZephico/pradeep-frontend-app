import contactData from "@/data/contact.json";

export default function FAQ() {
  const { faq } = contactData;

  return (
    <section className="contact-faq">
      <div className="contact-faq__container">
        <div className="contact-faq__header">
          <h2 className="contact-section-title contact-section-title--center">{faq.title}</h2>
        </div>

        <div className="contact-faq__list">
          {faq.items.map((item) => (
            <details
              key={item.question}
              className="contact-faq__item"
            >
              <summary className="contact-faq__question">
                <span className="contact-faq__question-inner">
                  <span className="contact-faq__icon">
                    +
                  </span>
                  {item.question}
                </span>
              </summary>

              <p className="contact-faq__answer">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}