
import "../style/components/footer.css";


const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer-center">
          <p>© {new Date().getFullYear()} BrightSmile Dental Clinic. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;
