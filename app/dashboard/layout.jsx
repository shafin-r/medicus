"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Work_Sans } from "next/font/google";
import { MdDashboard } from "react-icons/md";
import { FaUserMd } from "react-icons/fa";
import { PiListFill } from "react-icons/pi";
import { LuSyringe } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account } from "../appwrite";

import Image from "next/image";
import Link from "next/link";

const workSans = Work_Sans({ subsets: ["latin"] });

// app/dashboard/layout.jsx
export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await account.deleteSession("current");
    router.push("/login");
  }

  return (
    <ProtectedRoute>
      <body className={workSans.className}>
        <header className="flex justify-between px-60 py-4 bg-background border-b-[1px] border-accent">
          <Link href={"/dashboard"}>
            <Image
              src={require("@/public/static/logo-full.svg")}
              height={40}
              alt="logo"
            />
          </Link>
          <div className="flex gap-10 items-center">
            <a href="#" className="text-text">
              Help
            </a>
            <a href="#" className="text-text">
              Docs
            </a>
            <button
              onClick={handleLogout}
              className="text-background bg-primary hover:bg-yellow-500 hover:scale-110 px-4 py-2 rounded-2xl"
            >
              Logout
            </button>
          </div>
        </header>
        <div className="flex px-60 bg-background pt-8 min-h-[92.1vh]">
          <div className="flex flex-col justify-between w-60 h-5/6 bg-secondary text-text rounded-2xl py-4 px-2">
            <div className="flex flex-col">
              <Link
                href="/dashboard"
                className={`flex items-center text-lg font-regular tracking-tighter px-4 py-3 rounded-full gap-3 hover:bg-green-900 ${
                  pathname === "/dashboard" ? "bg-green-900" : ""
                }`}
              >
                <MdDashboard size={28} color="#4cc563" />
                <p>Home</p>
              </Link>
              <Link
                href="/dashboard/appointment"
                className={`flex items-center text-lg font-regular tracking-tighter px-4 py-3 rounded-full gap-3 hover:bg-green-900 ${
                  pathname === "/dashboard/appointment" ? "bg-green-900" : ""
                }`}
              >
                <FaUserMd size={28} color="#4cc563" />
                <p>Appointments</p>
              </Link>
              <Link
                href="/dashboard/prescription"
                className={`flex items-center text-lg font-regular tracking-tighter px-4 py-3 rounded-full gap-3 hover:bg-green-900 ${
                  pathname === "/dashboard/prescription" ? "bg-green-900" : ""
                }`}
              >
                <PiListFill size={28} color="#4cc563" />
                <p>Prescription</p>
              </Link>
              <Link
                href="/dashboard/vaccination"
                className={`flex items-center text-lg font-regular tracking-tighter px-4 py-3 rounded-full gap-3 hover:bg-green-900 ${
                  pathname === "/dashboard/vaccination" ? "bg-green-900" : ""
                }`}
              >
                <LuSyringe size={28} color="#4cc563" />
                <p>Vaccination</p>
              </Link>
              <Link
                href="/dashboard/profile"
                className={`flex items-center text-lg font-regular tracking-tighter px-4 py-3 rounded-full gap-3 hover:bg-green-900 ${
                  pathname === "/dashboard/profile" ? "bg-green-900" : ""
                }`}
              >
                <FaRegUserCircle size={28} color="#4cc563" />
                <p>Profile</p>
              </Link>
            </div>
          </div>
          <main className="flex-grow ">{children}</main>
        </div>
      </body>
    </ProtectedRoute>
  );
}
