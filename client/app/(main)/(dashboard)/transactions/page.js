"use client";

import { Button } from "@material-tailwind/react";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import { Urbanist } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Transaction from "@/components/layout/main/dashboard/transactions/transaction";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const walletAddress = useSelector((state) => state.wallet.walletAddress);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) fetchTransactions();
  }, [walletAddress]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    const response = await axios.get(
      `https://scan-api-testnet.viction.xyz/api/transaction/list?account=${walletAddress}&offset=0&limit=10`
    );

    console.log(response.data);
    setTransactions(response.data);
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex h-[92vh] flex-col justify-between items-center z-10 max-w-[480px] min-w-[350px] w-screen p-4 px-5">
        <div className="flex flex-col w-full h-[90%]">
          <h1 className="text-black/50 text-2xl mt-10">Recent Transactions</h1>
          <div className="flex flex-col w-full h-full mt-3 gap-3 overflow-y-auto no-scrollbar">
            {!isLoading &&
              transactions &&
              transactions.data &&
              transactions.data.length > 0 &&
              transactions.data.map((transaction, index) => {
                return (
                  <Transaction
                    transaction={transaction}
                    walletAddress={walletAddress}
                    key={index}
                  />
                );
              })}
            {isLoading && (
              <div className="flex justify-center items-center w-full h-full">
                <Loader2 className="animate-spin text-black/70" size={64} />
              </div>
            )}
            {!isLoading &&
              transactions &&
              transactions.data &&
              transactions.data.length === 0 && (
                <div className="flex justify-center items-center w-full h-full">
                  <h1 className="text-black/50 text-2xl font-normal">
                    No transactions yet
                  </h1>
                </div>
              )}
          </div>
        </div>

        <div
          className=" bg-white w-full h-[80px] min-h-[80px] flex items-start justify-center -mb-4 rounded-t-full"
          style={{
            background:
              "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7315126734287465) 35%, rgba(255,255,255,0) 100%)",
          }}
        >
          <Button
            color="white"
            size="lg"
            className={
              "mt-3 text-black/80 rounded-full flex items-center font-normal border-black/80 border-[1px] justify-center text-md w-[180px] " +
              urbanist.className
            }
            onClick={() => {
              router.push("/wallet");
            }}
          >
            <>
              <ArrowLeft className="text-black/80" size={14} />
              Back
            </>
          </Button>
        </div>
      </div>
    </>
  );
}
