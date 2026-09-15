import api from "./api";

export const getJobSeekerDashboard = async () => (await api.get("/api/job-seekers/me/dashboard")).data;
export const getEmployerDashboard = async () => (await api.get("/api/employers/me/dashboard")).data;
export const getAdminDashboard = async () => (await api.get("/api/admin/dashboard")).data;

export const getOpportunities = async (params = {}) => (await api.get("/api/opportunities", { params })).data;
export const getOpportunity = async (id) => (await api.get(`/api/opportunities/${id}`)).data;
export const applyForOpportunity = async (id, coverLetter, resume) => {
  const body = new FormData();
  if (coverLetter) body.append("cover_letter", coverLetter);
  body.append("resume", resume);
  return (await api.post(`/api/job-seekers/opportunities/${id}/apply`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;
};
export const getMyApplications = async () => (await api.get("/api/job-seekers/me/applications")).data;
export const withdrawApplication = async (id) => (await api.patch(`/api/job-seekers/me/applications/${id}/withdraw`)).data;
export const getSavedOpportunities = async () => (await api.get("/api/job-seekers/me/saved-opportunities")).data;
export const saveOpportunity = async (id) => (await api.post(`/api/job-seekers/opportunities/${id}/save`)).data;
export const unsaveOpportunity = async (id) => (await api.delete(`/api/job-seekers/opportunities/${id}/save`)).data;

export const getEmployerProfile = async () => (await api.get("/api/employers/me/profile")).data;
export const updateEmployerProfile = async (body) => (await api.put("/api/employers/me/profile", body)).data;
export const uploadVerificationDocument = async (file) => {
  const body = new FormData();
  body.append("document", file);
  return (await api.post("/api/employers/me/verification-document", body, {
    headers: { "Content-Type": "multipart/form-data" },
  })).data;
};
export const submitVerification = async () => (await api.post("/api/employers/me/verification-request")).data;
export const getEmployerOpportunities = async () => (await api.get("/api/employers/me/opportunities")).data;
export const createOpportunity = async (body) => (await api.post("/api/employers/me/opportunities", body)).data;
export const updateOpportunity = async (id, body) => (await api.put(`/api/employers/me/opportunities/${id}`, body)).data;
export const submitOpportunity = async (id) => (await api.post(`/api/employers/me/opportunities/${id}/submit`)).data;
export const closeOpportunity = async (id) => (await api.patch(`/api/employers/me/opportunities/${id}/close`)).data;
export const getEmployerApplicants = async (params = {}) => (await api.get("/api/employers/me/applicants", { params })).data;
export const updateApplicantStatus = async (id, body) => (await api.patch(`/api/employers/me/applicants/${id}/status`, body)).data;
export const downloadApplicantResume = async (id) => (await api.get(`/api/employers/me/applicants/${id}/resume`, { responseType: "blob" })).data;

export const getAdminEmployers = async (params = {}) => (await api.get("/api/admin/employers", { params })).data;
export const reviewEmployer = async (id, body) => (await api.patch(`/api/admin/employers/${id}/verification`, body)).data;
export const downloadEmployerDocument = async (id) => (await api.get(`/api/admin/employers/${id}/verification-document`, { responseType: "blob" })).data;
export const getAdminOpportunities = async (params = {}) => (await api.get("/api/admin/opportunities", { params })).data;
export const reviewOpportunity = async (id, body) => (await api.patch(`/api/admin/opportunities/${id}/review`, body)).data;
export const getAdminUsers = async (params = {}) => (await api.get("/api/admin/users", { params })).data;
export const updateUserStatus = async (id, body) => (await api.patch(`/api/admin/users/${id}/status`, body)).data;
export const getAdminActivities = async (params = {}) => (await api.get("/api/admin/activities", { params })).data;
export const getAdminProfile = async () => (await api.get("/api/admin/me/profile")).data;
export const updateAdminProfile = async (body) => (await api.put("/api/admin/me/profile", body)).data;

export const getNotifications = async (params = {}) => (await api.get("/api/notifications", { params })).data;
export const getUnreadCount = async () => (await api.get("/api/notifications/unread-count")).data;
export const markNotificationRead = async (id) => (await api.patch(`/api/notifications/${id}/read`)).data;
export const markAllNotificationsRead = async () => (await api.patch("/api/notifications/read-all")).data;
