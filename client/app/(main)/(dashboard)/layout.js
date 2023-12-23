import FallbackWindow from "@/components/layout/main/dashboard/fallbackWindow";
import WalletProvider from "@/providers/WalletProvider";

export default function LandingLayout({ children }) {
  return (
    <>
      <WalletProvider>{children}</WalletProvider>
      <FallbackWindow />
    </>
  );
}
