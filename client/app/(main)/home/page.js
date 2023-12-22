"use client";
import Step0 from "@/components/layout/main/home/step0";
import Step1Create from "@/components/layout/main/home/step1Create";
import Step1Enter from "@/components/layout/main/home/step1Enter";
import Step2Create from "@/components/layout/main/home/step2Create";
import Step3Create from "@/components/layout/main/home/step3Create";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Page() {
  const step = useSelector((state) => state.home.step);
  const flow = useSelector((state) => state.home.flow);
  return (
    <div className="flex-grow flex flex-col w-screen items-center justify-between z-10 transform mt-20">
      <div></div>
      <div className="flex flex-col items-center">
        {step === 0 && <Step0 />}
        {step === 1 && flow === "Enter" && <Step1Enter />}
        {step === 1 && flow === "Create" && <Step1Create />}
        {step === 2 && flow === "Create" && <Step2Create />}
        {step === 3 && flow === "Create" && <Step3Create />}
      </div>
      <Image
        src="/logo.svg"
        alt="Logo"
        width={40}
        height={40}
        className="mb-8"
      />
    </div>
  );
}
