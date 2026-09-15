import { useEffect, useState } from "react";
import { Icon, Intro } from "../../components/common/AppUI";
import useAuth from "../../hooks/useAuth";
import { getApiError } from "../../services/api";
import {
  getJobSeekerProfile,
  updateJobSeekerProfile,
} from "../../services/jobSeekerService";

const emptyProfile = {
  fullName: "",
  phone: "",
  city: "",
  province: "",
  qualification: "",
  institution: "",
  studyStatus: "Final year",
  graduationYear: "",
  professionalSummary: "",
  preferredRoles: [],
  preferredWorkMode: "Any",
  availability: "Immediately",
  skills: [],
  projects: [],
};

function fromApi(profile = {}) {
  return {
    fullName: profile.full_name || "",
    phone: profile.phone || "",
    city: profile.city || "",
    province: profile.province || "",
    qualification: profile.qualification || "",
    institution: profile.institution || "",
    studyStatus: profile.study_status || "Final year",
    graduationYear: profile.graduation_year || "",
    professionalSummary: profile.professional_summary || "",
    preferredRoles: profile.preferred_roles || [],
    preferredWorkMode: profile.preferred_work_mode || "Any",
    availability: profile.availability || "Immediately",
    skills: profile.skills || [],
    projects: profile.projects || [],
  };
}

function toApi(profile) {
  return {
    full_name: profile.fullName || null,
    phone: profile.phone || null,
    city: profile.city || null,
    province: profile.province || null,
    qualification: profile.qualification || null,
    institution: profile.institution || null,
    study_status: profile.studyStatus || null,
    graduation_year: profile.graduationYear || null,
    professional_summary: profile.professionalSummary || null,
    preferred_roles: profile.preferredRoles,
    preferred_work_mode: profile.preferredWorkMode || null,
    availability: profile.availability || null,
    skills: profile.skills,
    projects: profile.projects,
  };
}

export default function JobSeekerProfilePage() {
  const { user } = useAuth();
  const [draft, setDraft] = useState(emptyProfile);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobSeekerProfile()
      .then((profile) => setDraft(fromApi(profile)))
      .catch((requestError) => setError(getApiError(requestError)))
      .finally(() => setLoading(false));
  }, []);

  function change(field, value) {
    setSaved(false);
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const profile = await updateJobSeekerProfile(toApi(draft));
      setDraft(fromApi(profile));
      setSaved(true);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setSaving(false);
    }
  }

  function addSkill() {
    const skill = newSkill.trim();

    if (skill && !draft.skills.includes(skill)) {
      change("skills", [...draft.skills, skill]);
      setNewSkill("");
    }
  }

  if (loading) {
    return <div className="panel">Loading your profile...</div>;
  }

  return (
    <>
      <Intro
        eyebrow="CAREER PROFILE"
        title="Your complete career profile"
        copy="Employers use this information when reviewing your applications."
        action={<button className="button primary small" onClick={save} disabled={saving}>{saving ? "Saving..." : saved ? "Profile saved" : "Save profile"}</button>}
      />
      {error && <div className="form-error">{error}</div>}
      {saved && <div className="success"><Icon name="check" />Your profile changes were saved to the database.</div>}
      <section className="panel long-form">
        <h2 className="form-title">Personal information</h2>
        <div className="form-grid">
          <Field label="Full name" value={draft.fullName} onChange={(value) => change("fullName", value)} />
          <Field label="Email address" type="email" value={user?.email || ""} disabled />
          <Field label="Phone number" value={draft.phone} onChange={(value) => change("phone", value)} />
          <Field label="City" value={draft.city} onChange={(value) => change("city", value)} />
          <Field label="Province" value={draft.province} onChange={(value) => change("province", value)} />
          <label>Availability<select value={draft.availability} onChange={(event) => change("availability", event.target.value)}><option>Immediately</option><option>After graduation</option><option>One month notice</option></select></label>
          <label className="wide">Professional summary<textarea rows="4" value={draft.professionalSummary} onChange={(event) => change("professionalSummary", event.target.value)} /></label>
        </div>

        <h2 className="form-title">Education</h2>
        <div className="form-grid">
          <Field label="Qualification" value={draft.qualification} onChange={(value) => change("qualification", value)} />
          <Field label="Institution" value={draft.institution} onChange={(value) => change("institution", value)} />
          <label>Study status<select value={draft.studyStatus} onChange={(event) => change("studyStatus", event.target.value)}><option>Final year</option><option>Graduated</option><option>Postgraduate</option></select></label>
          <Field label="Graduation year" type="number" value={draft.graduationYear} onChange={(value) => change("graduationYear", value)} />
        </div>

        <h2 className="form-title">Career preferences</h2>
        <div className="form-grid">
          <Field label="Preferred roles (separate with commas)" value={draft.preferredRoles.join(", ")} onChange={(value) => change("preferredRoles", value.split(",").map((item) => item.trim()).filter(Boolean))} />
          <label>Preferred work mode<select value={draft.preferredWorkMode} onChange={(event) => change("preferredWorkMode", event.target.value)}><option>Hybrid</option><option>Remote</option><option>On-site</option><option>Any</option></select></label>
        </div>

        <h2 className="form-title">Skills</h2>
        <div className="tag-editor">{draft.skills.map((skill) => <span key={skill}>{skill}<button type="button" onClick={() => change("skills", draft.skills.filter((item) => item !== skill))}>×</button></span>)}</div>
        <div className="inline-add"><input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} placeholder="Add a skill" /><button type="button" className="button light small" onClick={addSkill}><Icon name="plus" />Add skill</button></div>

        <h2 className="form-title">Projects and experience</h2>
        <label>One project or experience per line<textarea rows="5" value={draft.projects.join("\n")} onChange={(event) => change("projects", event.target.value.split("\n").filter(Boolean))} /></label>

        <h2 className="form-title">Curriculum Vitae</h2>
        <div className="item-row"><Icon name="doc" /><span><b>CV upload will be connected next</b><small>The backend does not have a CV upload endpoint yet.</small></span></div>
      </section>
    </>
  );
}

function Field({ label, type = "text", value, onChange = () => {}, disabled = false }) {
  return <label>{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} /></label>;
}
