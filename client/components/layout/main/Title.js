import Image from "next/image";

export default function Title() {
  return (
    <div className="z-10 mt-10">
      <Image src="/logo.svg" alt="Logo" width={60} height={60} />
    </div>
  );
}
