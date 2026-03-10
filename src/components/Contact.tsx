import { MdArrowOutward, MdCopyright, MdDownload } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:theshivamshukla.4uu@gmail.com" data-cursor="disable">
                theshivamshukla.4uu@gmail.com
              </a>
            </p>
            <h4>Resume</h4>
            <a
              href="/resume.pdf"
              target="_blank"
              download="Shivam_Shukla_Resume.pdf"
              className="resume-download-btn"
              data-cursor="disable"
            >
              Download Resume <MdDownload />
            </a>
            <h4>Education</h4>
            <p>B.Tech in Computer Science</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/shivam-shukla888"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/shivam-shukla-186276374/"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="https://x.com/S888Shivam"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Twitter <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/_shiv_am_262?utm_source=qr&igsh=eDZhbnR1NzltZm05"
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Shivam Shukla</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
