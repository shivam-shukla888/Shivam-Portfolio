import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <div className="landing-photo">
              <img src="/images/profile.png" alt="Shivam Shukla" />
            </div>
            <h2>Hello! I'm</h2>
            <h1>
              SHIVAM
              <br />
              <span>SHUKLA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Full Stack</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Java & Backend</div>
              <div className="landing-h2-2">Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Developer</div>
              <span className="profession">
            Final Year Computer Science Student <br />AI Agent & Backend Developer
          </span>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
