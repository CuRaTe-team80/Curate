import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "curate_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  const login = (jwtToken) => {
    if (!jwtToken) {
      throw new Error("Authentication token was not provided.");
    }

    setToken(jwtToken);
  };

  const logout = () => {
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated,
      login,
      logout,
    }),
    [token, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}