import QRCodeDialog from "@/components/dialogs/qrCodeDialog";

export const metadata = {
  title: "VUZI : Deposit",
  description: "The Wallet that your grandma approves",
};

export default function LandingLayout({ children }) {
  return (
    <>
      {children}
      <QRCodeDialog />
    </>
  );
}
