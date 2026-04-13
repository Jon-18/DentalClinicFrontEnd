// import "./ServiceCard.css";
import { useRef } from "react";
import "../style/components/servicecard.css";

function ServiceCard({ icon, title, description }) {
  const services = [
    {
      title: "Consultation",
      desc: "A comprehensive dental check-up and assessment to evaluate your oral health and discuss personalized treatment options.",
      img: "assets/Consultation.jpg",
    },
    {
      title: "Oral Prophylaxis",
      desc: "A professional cleaning procedure that removes plaque, tartar, and stains to keep your teeth and gums healthy.",
      img: "assets/TeethWhitening.jpg",
    },
    {
      title: "Tooth Filling",
      desc: "A restorative treatment that repairs cavities or damaged teeth, restoring their natural shape and function.",
      img: "assets/ToothFiling.jpg",
    },
    {
      title: "Dental Crowns",
      desc: "Custom-made caps that cover and strengthen damaged or weakened teeth, improving both appearance and durability.",
      img: "assets/DentalCrowns.jpg",
    },
    {
      title: "Partial and Complete Denture",
      desc: "Removable dental appliances that replace missing teeth, restoring your smile and ability to chew comfortably.",
      img: "assets/PartialDenture.jpg",
    },
    {
      title: "Root Canal Treatment",
      desc: "A procedure to remove infected pulp from inside the tooth, relieving pain and saving the natural tooth.",
      img: "assets/RootCanalTreatment.jpg",
    },
    {
      title: "Orthodontic Treatment",
      desc: "Corrective procedures, such as braces or aligners, that straighten teeth and improve bite alignment for a healthier smile.",
      img: "assets/OrodonthicTreatment.jpg",
    }
  ]

  const sliderRef = useRef(null);

  const scrollAmount = () => {
    const slider = sliderRef.current;
    const card = slider.querySelector(".service-card");
    return card.offsetWidth + 20; // include margin
  };

  const nextSlide = () => {
    sliderRef.current.scrollBy({
      left: scrollAmount() * 5,
      behavior: "smooth",
    });
  };

  const prevSlide = () => {
    sliderRef.current.scrollBy({
      left: -scrollAmount() * 5,
      behavior: "smooth",
    });
  };
  return (
    <section id="services" className="services-section">
      <h1>Our Dental Services</h1>

      <div className="slider-container">
        <button className="prev-btn" onClick={prevSlide}>
          ❮
        </button>

        <div className="service-slider" ref={sliderRef}>
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <img src={service.img} alt={service.title} />
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>

        <button className="next-btn" onClick={nextSlide}>
          ❯
        </button>
      </div>
    </section>
  );
}


export default ServiceCard;