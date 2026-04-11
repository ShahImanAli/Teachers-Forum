import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";

export const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get("/api/v1/users/current-user", {
          withCredentials: true,
        });
        const data = response.data;

        setAuth({ user: data.data, loading: false });
      } catch (error) {
        setAuth({ user: null, loading: false });
      }
    };

    verifyUser();
  }, []);

  const login = (user) => {
    setAuth({ user, loading: false });
  };

  const logout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { 
        withCredentials: true 
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
    setAuth({ user: null, loading: false });
  };

  const updateUser = (userData) => {
    setAuth((prev) => ({ ...prev, user: { ...prev.user, ...userData } }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateUser }}>
      {!auth.loading ? children : <Loader />}
    </AuthContext.Provider>
  );
};
