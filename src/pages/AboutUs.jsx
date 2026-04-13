import '../style/pages/AboutUs.css';

const AboutUs = () => {
  return (
    <section id="about-us" className="about-us">
      <div className="container">
        <h1>About Sibonga Dental Clinic</h1>
        <p>
          Welcome to <strong>Sibonga Dental Clinic</strong>, where your smile is our top priority! 
          We are committed to providing gentle, personalized dental care using the latest 
          technology and techniques.
        </p>

        <h2>Our Mission</h2>
        <p>
          To deliver high-quality, affordable, and comfortable dental services 
          in a caring environment that makes every patient feel at home.
        </p>

        <h2>Our Team</h2>
        <p>
          Our experienced team of dentists and hygienists are passionate about 
          helping you achieve and maintain a healthy, confident smile. 
          Whether you need a routine check-up or a full smile makeover, we’re here for you.
        </p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>Comprehensive family dental care</li>
          <li>Modern equipment & sterilization standards</li>
        </ul>
        <ul>
          <li>Friendly, experienced dental professionals</li>
          <li>Flexible appointments and payment options</li>
        </ul>
      </div>
      <div className="container-photo">
        <img src='./assets/dentist-with-smile.jpg'  alt="Sibonga Dental Clinic"/>
      </div>
    </section>
  );
};

export default AboutUs;
