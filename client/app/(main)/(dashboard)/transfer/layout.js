import TransferDialog from "@/components/dialogs/transferDialog";

export const metadata = {
  title: "VUZI : Transfer",
  description: "The Wallet that your grandma approves",
};

export default function LandingLayout({ children }) {
  return (
    <>
      {children}
      <TransferDialog />
    </>
  );
}
