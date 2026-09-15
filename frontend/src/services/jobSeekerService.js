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
