import FutureDialog from "@/components/dialogs/futureDialog";
import HorizonDialog from "@/components/dialogs/horizonDialog";
import IntroDialog from "@/components/dialogs/introDialog";
import Background from "@/components/layout/main/Background";
import Title from "@/components/layout/main/Title";

export const metadata = {
  title: "VUZI",
  description: "The Wallet that your grandma approves",
};

export default function LandingLayout({ children }) {
  return (
    <>
      <div className="h-screen max-h-screen w-screen relative overflow-hidden flex flex-col items-center">
        <Title />
        {children}
        <Background />
        <IntroDialog />
        <HorizonDialog />
        <FutureDialog />
      </div>
    </>
  );
}
