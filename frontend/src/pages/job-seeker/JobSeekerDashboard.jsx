import { Link } from "react-router-dom";

import { Icon, Intro, Stat } from "../../components/common/AppUI";
import { jobs } from "../../data/mockData";
import useAuth from "../../hooks/useAuth";
import { Company } from "./JobCard";
import { matchScore } from "./jobUtils";


function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}


export default function JobSeekerDashboard({
  applications,
  savedCount,
}) {
  const { user } = useAuth();

  const firstName =
    user?.first_name || "Job Seeker";

  return (
    <>
      <Intro
        eyebrow="JOB SEEKER DASHBOARD"
        title={`${getGreeting()}, ${firstName}`}
        copy={
          "Review your profile, matches and " +
          "recent applications."
        }
        action={
          <Link
            className="button primary small"
            to="/job-seeker/jobs"
          >
            Find opportunities
          </Link>
        }
      />

      <div className="stats">
        <Stat
          label="Profile strength"
          value="82%"
          note="Add one project"
          tone="orange"
          icon="user"
        />

        <Stat
          label="Strong matches"
          value="3"
          note="80% or higher"
          tone="teal"
          icon="check"
        />

        <Stat
          label="Applications"
          value={applications.length}
          note="Track your progress"
          icon="doc"
        />

        <Stat
          label="Saved opportunities"
          value={savedCount}
          note="Review before closing"
          tone="purple"
          icon="bookmark"
        />
      </div>

      <section className="panel">
        <h2 className="form-title">
          Recommended opportunities
        </h2>

        {jobs.slice(0, 3).map((job) => (
          <Link
            className="compact-job"
            key={job.id}
            to={`/job-seeker/jobs/${job.id}`}
          >
            <Company name={job.company} />

            <div>
              <h3>{job.title}</h3>

              <p>
                {job.company} · {job.location}
              </p>

              <span>{job.type}</span>
            </div>

            <strong>
              {matchScore(job)}%
              <small>match</small>
            </strong>

            <Icon name="arrow" />
          </Link>
        ))}
      </section>
    </>
  );
}