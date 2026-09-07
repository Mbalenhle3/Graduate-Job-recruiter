import {
  FiUserPlus,
  FiSearch,
  FiSend,
  FiTrendingUp,
} from "react-icons/fi";

import "./HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <FiUserPlus />,
      title: "Create Your Profile",
      description:
        "Create your GraduateLink SA profile and showcase your education, skills, projects, certifications and achievements.",
    },
    {
      number: "02",
      icon: <FiSearch />,
      title: "Discover Opportunities",
      description:
        "Find verified internships, graduate programmes and entry-level opportunities that match your skills and interests.",
    },
    {
      number: "03",
      icon: <FiSend />,
      title: "Apply With Confidence",
      description:
        "Use your professional CV and application tools to apply for opportunities and keep track of your applications.",
    },
    {
      number: "04",
      icon: <FiTrendingUp />,
      title: "Build Your Career",
      description:
        "Improve your skills, receive career guidance, connect with mentors and take the next step toward employment.",
    },
  ];

  return (
    <section className="how-it-works">

      <div className="how-it-works-container">

        {/* Section Heading */}

        <div className="how-it-works-heading">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            Your journey from graduate to professional
          </h2>

          <p>
            GraduateLink SA makes it easier to move from university
            into the workplace by bringing opportunities, career
            support and professional development together.
          </p>

        </div>

        {/* Steps */}

        <div className="steps-container">

          {steps.map((step, index) => (

            <div className="step-wrapper" key={index}>

              <div className="step-card">

                <div className="step-top">

                  <span className="step-number">
                    {step.number}
                  </span>

                  <div className="step-icon">
                    {step.icon}
                  </div>

                </div>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>

              </div>

              {/* Connecting Line */}

              {index < steps.length - 1 && (
                <div className="step-line"></div>
              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;