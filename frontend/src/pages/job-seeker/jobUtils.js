export const pretty = (value = "") => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
export const formatDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" }) : "—";
export const toJobView = (job = {}) => ({ ...job, id: String(job.id), company: job.organisation_name || "Verified employer", location: [job.location, job.province].filter(Boolean).join(", ") || "South Africa", mode: pretty(job.work_mode), type: pretty(job.opportunity_type), closing: formatDate(job.closing_date), skills: [], matched: [] });
export const matchScore = () => 0;
