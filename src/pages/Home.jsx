// import Footer from "../components/Footer";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/NavbarHeader";
import ServiceCard from "../components/ServiceCard";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ServiceCard />
      <AboutUs />
      <ContactUs />
      <Footer/>

    </>
  );
}

export default Home;