import api from "./api";

export async function getJobSeekerProfile() {
  const response = await api.get("/api/job-seekers/me/profile");
  return response.data;
}

export async function updateJobSeekerProfile(profile) {
  const response = await api.put(
    "/api/job-seekers/me/profile",
    profile,
  );
  return response.data;
}

export async function uploadJobSeekerCv(file) {
  const body = new FormData();
  body.append("cv", file);
  const response = await api.post("/api/job-seekers/me/cv", body);
  return response.data;
}

export async function downloadJobSeekerCv() {
  const response = await api.get("/api/job-seekers/me/cv", {
    responseType: "blob",
  });
  return response.data;
}

export async function deleteJobSeekerCv() {
  const response = await api.delete("/api/job-seekers/me/cv");
  return response.data;
}
