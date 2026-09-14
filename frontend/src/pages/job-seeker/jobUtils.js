export const matchScore = (job) => Math.round((job.matched.length/job.skills.length)*70+25);
