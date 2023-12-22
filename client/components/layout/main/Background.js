import Image from "next/image";

export default function Background() {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0">
      <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
        <Image
          src="/images/backgrounds/main.png"
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
