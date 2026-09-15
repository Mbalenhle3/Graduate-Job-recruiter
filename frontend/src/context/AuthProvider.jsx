import { useEffect, useState } from "react";
import {
  getCurrentAccount,
  signinAccount,
  signupAccount,
} from "../services/authService";
import AuthContext from "./authContext";

const TOKEN_KEY = "graduatelink-access-token";
const USER_KEY = "graduatelink-user";

function readStoredUser() {
  try {
    if (!localStorage.getItem(TOKEN_KEY)) return null;
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem(TOKEN_KEY)),
  );

  function saveAuthentication(authentication) {
    localStorage.setItem(TOKEN_KEY, authentication.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(authentication.user));
    setUser(authentication.user);
    return authentication.user;
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    getCurrentAccount()
      .then((currentUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        setUser(currentUser);
      })
      .catch(() => signOut())
      .finally(() => setLoading(false));
  }, []);

  async function signIn(credentials) {
    return saveAuthentication(await signinAccount(credentials));
  }

  async function signUp(account) {
    return saveAuthentication(await signupAccount(account));
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
