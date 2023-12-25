import RecoverDialog from "@/components/dialogs/recoverDialog";
import FallbackWindow from "@/components/layout/main/recover/FallbackManager";

export const metadata = {
  title: "VUZI : Recover",
  description: "The Wallet that your grandma approves",
};

export default function LandingLayout({ children }) {
  return (
    <>
      {children}
      <FallbackWindow />
      <RecoverDialog />
    </>
  );
}
