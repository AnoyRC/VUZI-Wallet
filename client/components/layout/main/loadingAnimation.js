import { Loader2 } from "lucide-react";

const LoadingAnimation = ({ width, height, size = 80 }) => {
  return (
    <div
      className={`flex justify-center items-center bg-white ${
        width ? width : "w-full"
      } ${height ? height : "h-full"}`}
    >
      <Loader2 size={size} className="animate-spin text-black/70 mb-10" />
    </div>
  );
};
export default LoadingAnimation;
