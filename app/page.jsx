"use client";
import Image from "next/image";
import Link from "next/link";
import { Frank_Ruhl_Libre } from "next/font/google";

const ruhLibre = Frank_Ruhl_Libre({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="bg-[#070E06] min-h-screen">
      <section className="py-[40px] px-[80px]">
        <header className="flex items-center justify-between">
          <Image src="/static/logo.png" width={200} height={1000} alt="logo" />
          <div className="flex flex-row gap-80 text-lg">
            <Link href={"/about"} className="text-white font-medium">
              About
            </Link>
            <Link href={"/pricing"} className="text-white font-medium">
              Pricing
            </Link>
            <Link href={"/contact"} className="text-white font-medium">
              Contact
            </Link>
            <Link href={"/login"} className="text-white font-medium">
              Sign In
            </Link>
          </div>
        </header>
        <div className="flex flex-col py-16">
          <h1
            className={`${ruhLibre.className} text-[8rem] leading-[7rem] text-white`}
          >
            Your
          </h1>
          <h1
            className={`${ruhLibre.className} text-[8rem] leading-[7rem] text-white`}
          >
            Personal
          </h1>
          <h1
            className={`${ruhLibre.className} text-[8rem] leading-[7rem] text-white`}
          >
            Healthcare
          </h1>
          <h1
            className={`${ruhLibre.className} text-[8rem] leading-[7rem] text-white`}
          >
            Partner
          </h1>
        </div>
        <div className="flex-row justify-between flex items-center">
          <div className="w-1/2">
            <Image
              src="/icons/hero-arrow.png"
              width={100}
              height={50}
              alt="hero"
            />
          </div>
          <div className="w-1/2 px-32 flex flex-col gap-4">
            <p className="text-[#E5F5E5] text-4xl tracking-tighter font-normal">
              Medicus is a healthcare portal system designed and developed with
              the patient and their concerns at its core.{" "}
            </p>
            <div className="flex gap-2 justify-center items-center py-3 bg-[#E5F5E5] w-1/4 rounded-2xl cursor-pointer">
              <div className="rounded-full w-2 h-2 bg-[#517AB3]"></div>
              <p className="text-md font-medium tracking-tighter">LEARN MORE</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
