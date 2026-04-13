import { FaFacebookF, } from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import '../style/pages/ContactUs.css';


const ContactUs = () => {
  return (
    <>
      <section id="contact-us-page" className="contact-us-page">
        <h1>Contact Us</h1>
        <div className="container-contact-us-page">
          <div className="contact-info-page">
              <div className="contact-box">
                <h3>Contact Information</h3>
                  <p><MdEmail className="icon" /> sibongadentalclinic@gmail.com</p>
                  <p><MdPhone className="icon" /> 0917 182 1861</p>
                  <p><MdLocationOn className="icon" /> Blk. 59, Lot 37 Laurel Street Freedom Park 5, Batasan Hills, Quezon City, Philippines</p>
                    <a href="https://www.facebook.com/sibongadentalclinic" target="_blank" rel="noopener noreferrer">
                    <FaFacebookF className="icon" /> Sibonga Dental Clinic
                  </a>
                  <div className="clinic-hours">
                  <h3>Clinic Hours</h3>
                    <table>
                      <tbody>
                        <tr><td>Mon to Fri :</td><td>10am – 6pm</td></tr>
                        <tr><td>Sat :</td><td>10am – 6pm</td></tr>
                        <tr><td>Sun :</td><td>9:30am – 5pm</td></tr>
                      </tbody>
                    </table>
                </div>
              </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
