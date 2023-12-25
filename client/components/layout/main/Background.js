"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Background() {
  const pathName = usePathname();
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0">
      <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
        <Image
          src={`/images/backgrounds/${(() => {
            switch (pathName) {
              case "/":
                return "main";
              case "/home":
                return "home";
              case "/wallet":
                return "wallet";
              case "/transfer":
                return "transfer";
              case "/transactions":
                return "tx";
              case "/deposit":
                return "deposit";
              case "/recover":
                return "recover";
              default:
                return "default";
            }
          })()}.png`}
          alt="Background"
          width={800}
          height={1000}
        />
      </div>
      <div
        className="absolute top-0 transform 
      -translate-y-3/4 left-1/2 -translate-x-1/2 opacity-60
      "
      >
        <Image
          src="/images/backgrounds/common.png"
          alt="Background"
          width={750}
          height={750}
        />
      </div>
    </div>
  );
}
