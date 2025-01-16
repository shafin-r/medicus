// components/ProtectedRoute.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        setLoading(false);
      } catch (error) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="loader"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
