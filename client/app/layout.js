import { Urbanist } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import { store } from "@/redux/store";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "VUZI",
  description: "The Wallet that your grandma approves",
};

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <ReduxProvider store={store}>
          {children}
          <Toaster
            position="bottom-left"
            reverseOrder={false}
            toastOptions={{
              style: {
                fontFamily: urbanist.fontFamily,
                background: "#333",
                color: "#fff",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#333",
              },
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
