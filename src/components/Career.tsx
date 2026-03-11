import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Java with Spring Boot Intern</h4>
                <h5>Soft Pro</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Developed 8+ RESTful APIs using Java and Spring Boot following MVC
              architecture. Integrated MySQL with Hibernate ORM, improving query
              performance by 20%. Worked in an Agile environment.
              <br />
              <a href="https://drive.google.com/file/d/1KmW_xZv7xv9pjj2SH0k3hvzHvs_ZrNS9/view" target="_blank" rel="noopener noreferrer" className="certificate-link">
                View Certificate
              </a>
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Science</h4>
                <h5>SRMS CET&R, Bareilly</h5>
                <h3>2022 - 2026</h3>
              </div>
            </div>
            <p>
              Pursuing Computer Science Engineering with specialization in backend development, 
              systems design, and AI Agent integration. Building strong foundation in 
              software engineering principles and modern technologies.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Secondary School</h4>
                <h5>Nav Jeevan Mission School</h5>
              </div>
              <h3>2021</h3>
            </div>
            <p>
              Completed Senior Secondary (CBSE) with a strong foundation in science
              and mathematics, preparing for higher education in engineering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
