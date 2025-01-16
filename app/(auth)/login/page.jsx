"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/app/appwrite";
import { Work_Sans } from "next/font/google";
const workSans = Work_Sans({ subsets: ["latin"] });

const Login = () => {
  const router = useRouter();
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
  });

  async function checkUser() {
    try {
      await account.get();
      router.push("/dashboard"); // Fetch user info
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(email, password) {
    await account.createEmailPasswordSession(email, password);
    router.push("/dashboard");
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  return (
    <main
      className={`bg-[#070E06] max-h-screen flex justify-between ${workSans.className}`}
    >
      <section className="w-1/2 p-20 space-y-12 flex flex-col items-center justify-center">
        <div className="space-y-4">
          <Image src="/static/logo.png" width={200} height={1000} alt="logo" />
          <h1 className="text-white text-5xl  tracking-tight font-bold">
            Login to your account
          </h1>
          <p
            className="text-white tracking-tight
        text-2xl"
          >
            Sign in with your Medicus account to get started!
          </p>
        </div>
        <div className="flex flex-col w-3/4 space-y-6">
          <div className="flex flex-col gap-4">
            <p className="text-white">Email Address</p>
            <input
              name="email" // Fixed to match the state key
              type="email"
              className="rounded-lg h-12 px-4 w-full"
              value={newUser.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-white">Password</p>
            <input
              name="password" // Fixed to match the state key
              type="password"
              className="rounded-lg h-12 px-4 w-full"
              value={newUser.password}
              onChange={handleInputChange}
            />
          </div>
          <button
            onClick={() => handleLogin(newUser.email, newUser.password)}
            className="w-full text-black bg-green-500 h-12 rounded-2xl"
          >
            Login
          </button>
          <p className="text-text">Don&apos;t have an account?</p>
          <button
            onClick={() => router.push("/register")}
            className="w-full text-text bg-blue-500 h-12 rounded-2xl"
          >
            Register
          </button>
        </div>
      </section>
      <section className="w-1/2 overflow-hidden flex flex-col justify-center">
        <Image
          src={"/static/login-splash.jpg"}
          width={1000}
          height={1000}
          alt="login-splash"
        />
      </section>
    </main>
  );
};

export default Login;
