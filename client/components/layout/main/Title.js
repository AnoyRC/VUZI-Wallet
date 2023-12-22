"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Title() {
  const pathName = usePathname();

  return (
    <div className="z-10 mt-10">
      {pathName === "/" && (
        <Image src="/logo.svg" alt="Logo" width={60} height={60} />
      )}
      {pathName === "/home" && (
        <h1 className="text-3xl font-semibold text-black/80">HOME</h1>
      )}
    </div>
  );
}
