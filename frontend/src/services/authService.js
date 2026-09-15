import api from "./api";

export async function signupAccount(account) {
  const response = await api.post("/api/auth/signup", account);
  return response.data;
}

export async function signinAccount(credentials) {
  const response = await api.post("/api/auth/signin", credentials);
  return response.data;
}

export async function getCurrentAccount() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

export async function requestPasswordReset(email) {
  const response = await api.post("/api/auth/forgot-password", { email });
  return response.data;
}

export async function resetPassword(token, newPassword) {
  const response = await api.post("/api/auth/reset-password", {
    token,
    new_password: newPassword,
  });
  return response.data;
}
