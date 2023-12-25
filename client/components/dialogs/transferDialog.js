"use client";

import { handleTransferDialog } from "@/redux/slice/dialogSlice";
import { Dialog, DialogBody, Button } from "@material-tailwind/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Urbanist } from "next/font/google";
import { useState } from "react";
import useVUZI from "@/hooks/useVUZI";
import { setIsLoading } from "@/redux/slice/transferSlice";
import { ethers } from "ethers";
import { Loader2 } from "lucide-react";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function TransferDialog() {
  const transferDialog = useSelector((state) => state.dialog.transferDialog);
  const dispatch = useDispatch();
  const type = useSelector((state) => state.transfer.type);
  const walletAddress = useSelector((state) => state.transfer.walletAddress);
  const amount = useSelector((state) => state.transfer.amount);
  const domain = useSelector((state) => state.transfer.domain);
  const isLoading = useSelector((state) => state.transfer.isLoading);
  const [isSuccess, setIsSuccess] = useState(false);
  const { executeTx } = useVUZI();
  const name = useSelector((state) => state.wallet.name);
  const password = useSelector((state) => state.wallet.password);
  const { fetchWalletData } = useVUZI();

  const handleTransfer = async () => {
    dispatch(setIsLoading(true));
    const success = await executeTx(
      name,
      password,
      walletAddress,
      ethers.utils.parseEther(amount),
      "0x"
    );
    await fetchWalletData();
    setIsSuccess(success);
    dispatch(setIsLoading(false));
  };

  return (
    <Dialog
      open={transferDialog}
      handler={() => {
        if (isLoading) return;
        dispatch(handleTransferDialog());
      }}
      className="bg-transparent flex-col shadow-none flex items-center justify-center w-1/4"
    >
      <DialogBody className={"rounded-lg " + urbanist.className}>
        <div className="bg-white  min-w-[450px] w-full text-lg text-black/80 rounded-3xl flex flex-col items-center justify-center text-center p-4 py-10">
          <Image
            src="/logo.svg"
            width={40}
            height={40}
            alt="transfer"
            className="opacity-90 mb-5"
          />
          {!isLoading && !isSuccess && (
            <h2>
              You are going to transfer{" "}
              <span className="font-bold"> {Number(amount).toFixed(2)} </span>{" "}
              to{" "}
              <span className="font-bold">
                {type === "Address"
                  ? walletAddress.substring(0, 6) +
                    "..." +
                    walletAddress.substring(38, 42)
                  : domain.length > 10
                  ? domain.substring(0, 7) + "..."
                  : domain}
              </span>
              . <br />
              Ready to proceed ?
            </h2>
          )}

          {isLoading && <h2>Please wait while we process your transaction</h2>}

          {isSuccess && !isLoading && <h2> Transfer Successful </h2>}

          <div className="flex items-center justify-center w-full gap-2">
            {!isLoading && !isSuccess && (
              <>
                {" "}
                <Button
                  color="white"
                  size="lg"
                  className={
                    "mt-8 rounded-full flex items-center border-black border-[1px] justify-center text-lg w-[180px] " +
                    urbanist.className
                  }
                  onClick={() => {
                    if (isLoading) return;
                    dispatch(handleTransferDialog());
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="black"
                  size="lg"
                  className={
                    "mt-8 rounded-full flex items-center justify-center text-lg w-[180px] " +
                    urbanist.className
                  }
                  onClick={() => {
                    handleTransfer();
                  }}
                >
                  Confirm
                </Button>
              </>
            )}

            {isSuccess && !isLoading && (
              <Button
                color="black"
                size="lg"
                className={
                  "mt-8 rounded-full flex items-center justify-center text-lg w-[180px] " +
                  urbanist.className
                }
                onClick={() => {
                  setIsSuccess(false);
                  dispatch(handleTransferDialog());
                }}
              >
                Close
              </Button>
            )}

            {isLoading && <Loader2 className="animate-spin mt-8" size={24} />}
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
}
