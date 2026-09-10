export const ROLE_HOME = {
  seeker: "/job-seeker/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
};

export const jobs = [
  { id:"1", title:"Graduate Software Developer", company:"Thrive Digital", location:"Durban, KwaZulu-Natal", mode:"Hybrid", type:"Graduate programme", closing:"28 Sep 2026", salary:"R22 000 - R28 000 monthly", qualification:"Computer Science or IT", experience:"No experience required", skills:["JavaScript","React","Git","SQL"], matched:["JavaScript","SQL"], description:"Join a supported twelve-month graduate programme building accessible digital services." },
  { id:"2", title:"Junior Data Analyst", company:"Ubuntu Insights", location:"Johannesburg, Gauteng", mode:"Hybrid", type:"Entry-level job", closing:"03 Oct 2026", salary:"R20 000 - R25 000 monthly", qualification:"Degree or diploma in a quantitative field", experience:"Academic projects accepted", skills:["Python","SQL","Excel","Communication"], matched:["Python","SQL","Communication"], description:"Turn operational data into clear reports while learning from experienced mentors." },
  { id:"3", title:"Cybersecurity Graduate", company:"Cape Secure Labs", location:"Cape Town, Western Cape", mode:"On-site", type:"Graduate programme", closing:"15 Oct 2026", salary:"Market related", qualification:"IT, Computer Science or related degree", experience:"No experience required", skills:["Networking","Linux","Security","Communication"], matched:["Networking","Communication"], description:"Learn security monitoring, incident handling and vulnerability management." },
  { id:"4", title:"IT Support Learnership", company:"Imbizo Technologies", location:"Pietermaritzburg, KwaZulu-Natal", mode:"On-site", type:"Learnership", closing:"30 Sep 2026", salary:"Monthly stipend", qualification:"Matric with IT studies or an IT qualification", experience:"No experience required", skills:["Hardware","Networking","Windows","Customer service"], matched:["Networking","Windows"], description:"Develop service-desk and desktop-support skills through workplace learning." },
  { id:"5", title:"Cloud Engineering Intern", company:"Karoo Cloud", location:"South Africa", mode:"Remote", type:"Internship", closing:"10 Oct 2026", salary:"R12 000 monthly stipend", qualification:"Final-year IT or Computer Science student", experience:"Academic projects accepted", skills:["Linux","Python","Git","Cloud fundamentals"], matched:["Python"], description:"Support cloud deployments and learn modern platform operations remotely." },
];

export const initialApplications = [
  { id:"a1", jobId:"2", title:"Junior Data Analyst", company:"Ubuntu Insights", date:"06 Sep 2026", status:"Under review" },
  { id:"a2", jobId:"4", title:"IT Support Learnership", company:"Imbizo Technologies", date:"31 Aug 2026", status:"Interview" },
];

export const initialEmployerJobs = [
  { id:1, title:"Graduate Software Developer", location:"Durban", applicants:38, status:"Active", closing:"28 Sep 2026" },
  { id:2, title:"UX Design Intern", location:"Durban", applicants:24, status:"Active", closing:"04 Oct 2026" },
  { id:3, title:"Junior QA Tester", location:"Remote", applicants:51, status:"Closed", closing:"31 Aug 2026" },
];

export const initialEmployers = [
  { id:1, name:"Thrive Digital", email:"careers@thrivedigital.co.za", document:"Company registration", status:"Approved" },
  { id:2, name:"Ikhaya Energy", email:"talent@ikhayaenergy.co.za", document:"Company registration", status:"Pending" },
  { id:3, name:"Ndlovu Consulting", email:"jobs@ndlovuconsulting.co.za", document:"Supporting document missing", status:"Pending" },
];
