import "./TrustedSection.css";

function TrustedSection() {
  const companies = [
    "Microsoft",
    "Capitec",
    "Standard Bank",
    "Nedbank",
    "Amazon",
    "IBM",
    "MTN",
    "Vodacom",
  ];

  const statistics = [
    {
      number: "1,500+",
      label: "Verified Opportunities",
    },
    {
      number: "5,000+",
      label: "Graduate Users",
    },
    {
      number: "200+",
      label: "Partner Employers",
    },
    {
      number: "50+",
      label: "Career Resources",
    },
  ];

  return (
    <section className="trusted-section">

      {/* Trusted Companies */}
      <div className="trusted-container">

        <div className="trusted-heading">
          <span>OUR EMPLOYER NETWORK</span>

          <h2>
            Connecting graduates with trusted employers
          </h2>

          <p>
            GraduateLink SA aims to connect students and graduates
            with organisations offering internships, graduate
            programmes and entry-level opportunities.
          </p>
        </div>

        <div className="company-grid">
          {companies.map((company, index) => (
            <div className="company-card" key={index}>
              {company}
            </div>
          ))}
        </div>

      </div>

      {/* Statistics */}
      <div className="stats-container">

        {statistics.map((stat, index) => (
          <div className="stat-card" key={index}>

            <h3>
              {stat.number}
            </h3>

            <p>
              {stat.label}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default TrustedSection;