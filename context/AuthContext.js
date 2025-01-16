"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite"; // Adjust this import path to your setup

// Create Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState(null);

  async function fetchUser() {
    try {
      const user = await account.get(); // Fetch user info
      setLoggedInUser(user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setError(error.message);
      router.push("/login");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
