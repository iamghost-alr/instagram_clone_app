import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ig_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user._id) {
      refreshProfile();
    }
  }, [user]);

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`/api/user/${user._id}`);
      setProfile({
        bio: res.data.user?.bio || "",
        profilePicture: res.data.user?.profilePicture || "",
        followers: res.data.user?.followers || [],
        following: res.data.user?.following || [],
        role: res.data.role || "user",
        username: res.data.username || user.username
      });
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
    }
  };

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    try {
      const payload = usernameOrEmail.includes("@")
        ? { email: usernameOrEmail, password }
        : { username: usernameOrEmail, password };

      const res = await axios.post("/api/auth/login", payload);
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem("ig_user", JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (err) {
      setLoading(false);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (username, email, password, role) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", {
        username,
        email,
        password,
        role
      });
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout request error", err);
    } finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem("ig_user");
    }
  };

  const updateProfile = async (bio, profilePicture) => {
    try {
      const res = await axios.put(`/api/user/${user._id}`, { bio, profilePicture });
      setProfile(prev => ({
        ...prev,
        bio: res.data.user?.bio ?? prev.bio,
        profilePicture: res.data.user?.profilePicture ?? prev.profilePicture
      }));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Update profile failed");
    }
  };

  const followToggle = async (targetId, isCurrentlyFollowing) => {
    try {
      const url = `/api/user/${targetId}/${isCurrentlyFollowing ? "unfollow" : "follow"}`;
      await axios.post(url);
      await refreshProfile();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        followToggle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
