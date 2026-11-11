import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
import AuthContext from "./authContext.js";
import {
  createAccount,
  enablePersistentSession,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
} from "../services/authService.js";

function authErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/weak-password": "Password must contain at least 6 characters.",
  };
  return messages[error?.code] || error?.message || "Authentication failed.";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    enablePersistentSession()
      .then(() => {
        if (!active) return;
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
      })
      .catch((authError) => {
        if (!active) return;
        setError(authErrorMessage(authError));
        setLoading(false);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function runAuth(action) {
    setError("");
    try {
      return await action();
    } catch (authError) {
      const message = authErrorMessage(authError);
      setError(message);
      throw new Error(message);
    }
  }

  const value = {
    user,
    loading,
    error,
    clearError: () => setError(""),
    signup: (email, password) => runAuth(() => createAccount(email, password)),
    login: (email, password) => runAuth(() => loginWithEmail(email, password)),
    googleLogin: () => runAuth(loginWithGoogle),
    logout: () => runAuth(logoutUser),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
