import { useEffect, useState } from "react";
import { Icon, Intro } from "../../components/common/AppUI";
import useAuth from "../../hooks/useAuth";
import { getApiError } from "../../services/api";
import { deleteJobSeekerCv, downloadJobSeekerCv, getJobSeekerProfile, updateJobSeekerProfile, uploadJobSeekerCv } from "../../services/jobSeekerService";

const emptyProfile = { fullName:"", phone:"", city:"", province:"", qualification:"", institution:"", studyStatus:"Final year", graduationYear:"", professionalSummary:"", preferredRoles:[], preferredWorkMode:"Any", availability:"Immediately", skills:[], projects:[], cvName:null };

function fromApi(p={}) { return { fullName:p.full_name||"", phone:p.phone||"", city:p.city||"", province:p.province||"", qualification:p.qualification||"", institution:p.institution||"", studyStatus:p.study_status||"Final year", graduationYear:p.graduation_year||"", professionalSummary:p.professional_summary||"", preferredRoles:p.preferred_roles||[], preferredWorkMode:p.preferred_work_mode||"Any", availability:p.availability||"Immediately", skills:p.skills||[], projects:p.projects||[], cvName:p.cv_name||null }; }
function toApi(p) { return { full_name:p.fullName||"", phone:p.phone||"", city:p.city||"", province:p.province||"", qualification:p.qualification||"", institution:p.institution||"", study_status:p.studyStatus||"", graduation_year:p.graduationYear||"", professional_summary:p.professionalSummary||"", preferred_roles:p.preferredRoles, preferred_work_mode:p.preferredWorkMode||"Any", availability:p.availability||"", skills:p.skills, projects:p.projects }; }

export default function JobSeekerProfilePage() {
  const { user } = useAuth();
  const [draft,setDraft]=useState(emptyProfile), [newSkill,setNewSkill]=useState("");
  const [loading,setLoading]=useState(true), [saving,setSaving]=useState(false), [saved,setSaved]=useState(false);
  const [error,setError]=useState(""), [cvFile,setCvFile]=useState(null), [cvBusy,setCvBusy]=useState(false), [cvMessage,setCvMessage]=useState("");

  useEffect(()=>{ getJobSeekerProfile().then(p=>setDraft(fromApi(p))).catch(e=>setError(getApiError(e))).finally(()=>setLoading(false)); },[]);
  const change=(field,value)=>{ setSaved(false); setDraft(current=>({...current,[field]:value})); };
  async function save(){ setSaving(true);setSaved(false);setError("");try{setDraft(fromApi(await updateJobSeekerProfile(toApi(draft))));setSaved(true);}catch(e){setError(getApiError(e));}finally{setSaving(false);} }
  function addSkill(){const skill=newSkill.trim();if(skill&&!draft.skills.includes(skill)){change("skills",[...draft.skills,skill]);setNewSkill("");}}
  async function uploadCv(){if(!cvFile)return;setCvBusy(true);setError("");setCvMessage("");try{const p=await uploadJobSeekerCv(cvFile);setDraft(c=>({...c,cvName:p.cv_name}));setCvFile(null);setCvMessage("Your CV was uploaded successfully.");}catch(e){setError(getApiError(e));}finally{setCvBusy(false);}}
  async function downloadCv(){setCvBusy(true);setError("");try{const blob=await downloadJobSeekerCv();const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=draft.cvName||"curriculum-vitae.pdf";link.click();URL.revokeObjectURL(url);}catch(e){setError(getApiError(e));}finally{setCvBusy(false);}}
  async function removeCv(){if(!window.confirm("Remove your saved CV?"))return;setCvBusy(true);setError("");setCvMessage("");try{await deleteJobSeekerCv();setDraft(c=>({...c,cvName:null}));setCvMessage("Your saved CV was removed.");}catch(e){setError(getApiError(e));}finally{setCvBusy(false);}}

  if(loading)return <div className="panel">Loading your profile...</div>;
  return <>
    <Intro eyebrow="CAREER PROFILE" title="Your complete career profile" copy="Employers use this information when reviewing your applications." action={<button className="button primary small" onClick={save} disabled={saving}>{saving?"Saving...":saved?"Profile saved":"Save profile"}</button>}/>
    {error&&<div className="form-error">{error}</div>}{saved&&<div className="success"><Icon name="check"/>Your profile changes were saved.</div>}
    <section className="panel long-form">
      <h2 className="form-title">Personal information</h2><div className="form-grid">
        <Field label="Full name" value={draft.fullName} onChange={v=>change("fullName",v)}/><Field label="Email address" type="email" value={user?.email||""} disabled/><Field label="Phone number" value={draft.phone} onChange={v=>change("phone",v)}/><Field label="City" value={draft.city} onChange={v=>change("city",v)}/><Field label="Province" value={draft.province} onChange={v=>change("province",v)}/>
        <label>Availability<select value={draft.availability} onChange={e=>change("availability",e.target.value)}><option>Immediately</option><option>After graduation</option><option>One month notice</option></select></label>
        <label className="wide">Professional summary<textarea rows="4" value={draft.professionalSummary} onChange={e=>change("professionalSummary",e.target.value)}/></label>
      </div>
      <h2 className="form-title">Education</h2><div className="form-grid"><Field label="Qualification" value={draft.qualification} onChange={v=>change("qualification",v)}/><Field label="Institution" value={draft.institution} onChange={v=>change("institution",v)}/><label>Study status<select value={draft.studyStatus} onChange={e=>change("studyStatus",e.target.value)}><option>Final year</option><option>Graduated</option><option>Postgraduate</option></select></label><Field label="Graduation year" type="number" value={draft.graduationYear} onChange={v=>change("graduationYear",v)}/></div>
      <h2 className="form-title">Career preferences</h2><div className="form-grid"><Field label="Preferred roles (separate with commas)" value={draft.preferredRoles.join(", ")} onChange={v=>change("preferredRoles",v.split(",").map(i=>i.trim()).filter(Boolean))}/><label>Preferred work mode<select value={draft.preferredWorkMode} onChange={e=>change("preferredWorkMode",e.target.value)}><option>Hybrid</option><option>Remote</option><option>On-site</option><option>Any</option></select></label></div>
      <h2 className="form-title">Skills</h2><div className="tag-editor">{draft.skills.map(skill=><span key={skill}>{skill}<button type="button" onClick={()=>change("skills",draft.skills.filter(i=>i!==skill))}>×</button></span>)}</div><div className="inline-add"><input value={newSkill} onChange={e=>setNewSkill(e.target.value)} placeholder="Add a skill"/><button type="button" className="button light small" onClick={addSkill}><Icon name="plus"/>Add skill</button></div>
      <h2 className="form-title">Projects and experience</h2><label className="profile-textarea">One project or experience per line<textarea rows="5" placeholder="Example: Built a graduate recruitment platform using React and FastAPI" value={draft.projects.join("\n")} onChange={e=>change("projects",e.target.value.split("\n").filter(Boolean))}/></label>
      <h2 className="form-title">Curriculum Vitae</h2>{cvMessage&&<div className="success"><Icon name="check"/>{cvMessage}</div>}
      <div className={`cv-card ${draft.cvName?"has-cv":""}`}><div className="cv-icon"><Icon name="doc" size={25}/></div><div className="cv-copy"><b>{draft.cvName||cvFile?.name||"No CV uploaded yet"}</b><small>{draft.cvName?"This CV will be used automatically when you apply.":"Upload one PDF CV, up to 5 MB."}</small></div><div className="cv-actions">{draft.cvName&&<button type="button" className="button light small" onClick={downloadCv} disabled={cvBusy}>Download</button>}<label className="button light small cv-picker">{draft.cvName?"Replace CV":"Choose PDF"}<input type="file" accept="application/pdf,.pdf" onChange={e=>setCvFile(e.target.files?.[0]||null)}/></label>{cvFile&&<button type="button" className="button primary small" onClick={uploadCv} disabled={cvBusy}>{cvBusy?"Uploading...":"Upload CV"}</button>}{draft.cvName&&<button type="button" className="cv-delete" onClick={removeCv} disabled={cvBusy}>Remove</button>}</div></div>
      {cvFile&&<p className="cv-selected">Ready to upload: <b>{cvFile.name}</b></p>}
    </section>
  </>;
}

function Field({label,type="text",value,onChange=()=>{},disabled=false}){return <label>{label}<input type={type} value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}/></label>;}
