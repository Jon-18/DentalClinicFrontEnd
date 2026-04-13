import '../style/components/herosection.css';

const HeroSection = () => {
  return (
    <main className="body-container">
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to Sibonga Dental Clinic</h1>
          <p>
            Your trusted partner for healthy, beautiful smiles. We provide
            comprehensive dental care for all ages with modern technology and a
            gentle touch.
          </p>
          <button className="appointment-btn">Book an Appointment</button>
        </div>
        <div className="hero-image">
          <img
            src="assets/herobackground.jpg"
            alt="Dentist with patient"
          />
        </div>
      </section>
    </main>
  );
};

export default HeroSection;
