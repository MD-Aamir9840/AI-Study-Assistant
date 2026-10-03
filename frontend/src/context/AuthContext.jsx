import { createContext, useContext, useState } from "react";
import { loginOrRegister } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password, name = null, course = null) => {
    // Password is not used yet (no real auth backend) — kept for UX only.
    // The backend expects: { email, name?, course? }
    const payload = { email };
    if (name) payload.name = name;
    if (course) payload.course = course;

    const res = await loginOrRegister(payload);   // ✅ FIXED

    const userData = {
      student_id: res.data.student_id,
      email: res.data.email,
      name: res.data.name,
      course: res.data.course,
      loginAt: new Date().toISOString(),
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}