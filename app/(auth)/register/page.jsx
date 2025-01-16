"use client";

import { account, databases, ID } from "@/app/appwrite";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Register = () => {
  const [newUser, setNewUser] = useState({
    userId: "",
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState, // Spread the existing state
      [name]: value, // Update the specific field by name
    }));
  };

  async function handleLogin(email, password) {
    await account.createEmailPasswordSession(email, password);
    router.push("/dashboard");
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const newUserId = ID.unique(); // Generate unique user ID
      setNewUser((prevState) => ({ ...prevState, userId: newUserId }));

      // Create account using the newly generated userId
      await account.create(
        newUserId,
        newUser.email,
        newUser.password,
        newUser.username
      );

      // Create a document in the database for the new user
      await databases.createDocument(
        "6787fd2600013521f403",
        "6788db2a002f752f28a0",
        "unique()",
        { ...newUser, userId: newUserId } // Save the userId in the document
      );

      // Login the user after successful registration
      handleLogin(newUser.email, newUser.password);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="bg-[#070E06] max-h-screen flex justify-between">
      <section className="w-1/2 overflow-hidden flex flex-col justify-center">
        <Image
          src={"/static/register-splash.jpg"}
          width={1000}
          height={1000}
          alt="register"
        />
      </section>
      <section className="w-1/2 p-20 space-y-12 flex flex-col items-center justify-center">
        <div className="w-3/4 flex flex-col items-start space-y-3">
          <Image
            src="/static/logo.png"
            width={200}
            height={1000}
            className="mb-4"
            alt="logo"
          />
          <h1 className="text-white text-5xl tracking-tighter font-bold">
            Create an account
          </h1>
          <p className="text-white tracking-tight text-2xl">
            Make your own Medicus account and get started!
          </p>
        </div>
        <div className="flex flex-col w-3/4 space-y-6">
          <p className="text-white">username</p>
          <input
            name="username" // This matches the state key
            type="text"
            className="rounded-lg h-12 px-4"
            value={newUser.username}
            onChange={handleInputChange}
          />
          <p className="text-white">Email Address</p>
          <input
            name="email" // Fixed to match the state key
            type="email"
            className="rounded-lg h-12 px-4"
            value={newUser.email}
            onChange={handleInputChange}
          />
          <p className="text-white">Password</p>
          <input
            name="password" // Fixed to match the state key
            type="password"
            className="rounded-lg h-12 px-4"
            value={newUser.password}
            onChange={handleInputChange}
          />
          <button
            onClick={(e) => handleRegister(e)}
            className="w-full text-black bg-green-500 h-12 rounded-2xl"
          >
            Register
          </button>
          <p className="text-text">Already have an account?</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full text-text bg-blue-500 h-12 rounded-2xl"
          >
            Login
          </button>
        </div>
      </section>
    </main>
  );
};

export default Register;
