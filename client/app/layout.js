import { Urbanist } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import { store } from "@/redux/store";

export const metadata = {
  title: "VUZI",
  description: "Wallet that your grandma approves",
};

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <ReduxProvider store={store}>{children}</ReduxProvider>
      </body>
    </html>
  );
}
