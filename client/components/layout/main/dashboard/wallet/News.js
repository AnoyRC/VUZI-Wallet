"use client";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@material-tailwind/react";

export default function News({ title, desc, color, link }) {
  return (
    <div
      className="w-full border-black/80 border-[1px] flex flex-col rounded-2xl mt-3 p-5 py-3"
      style={{
        filter: `contrast(170%) brightness(400%)`,
        background: `linear-gradient(302deg,${color}, rgba(0,0,0,0)),
url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center text-black/50 font-semibold gap-2">
          <Image
            src="/logo.svg"
            width={20}
            height={20}
            alt="logo"
            className="opacity-80"
          />
          VUZI News
        </div>
        <Button
          className="bg-black/70 py-2 px-2"
          onClick={() => {
            window.open(link, "_blank");
          }}
        >
          <ArrowUpRight className="text-white" size={15} />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-between mt-2 text-black/70 text-3xl font-bold">
        {title}
        <p className="text-sm font-normal">{desc}</p>
      </div>
    </div>
  );
}
