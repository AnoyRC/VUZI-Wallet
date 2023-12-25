"use client";

import { handleRecoverDialog } from "@/redux/slice/dialogSlice";
import { Dialog, DialogBody, Button } from "@material-tailwind/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Urbanist } from "next/font/google";
import { useState } from "react";
import useVUZI from "@/hooks/useVUZI";
import {
  setIsLoading,
  setName,
  setPassword,
  setRecoveryCode,
  setWalletAddress,
} from "@/redux/slice/recoverSlice";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function RecoverDialog() {
  const recoverDialog = useSelector((state) => state.dialog.recoverDialog);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.recover.isLoading);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { executeRecovery } = useVUZI();
  const name = useSelector((state) => state.recover.name);
  const walletAddress = useSelector((state) => state.recover.walletAddress);
  const password = useSelector((state) => state.recover.password);
  const recoveryCode = useSelector((state) => state.recover.recoveryCode);

  const handleRecovery = async () => {
    dispatch(setIsLoading(true));
    const success = await executeRecovery(
      name,
      password,
      walletAddress,
      recoveryCode
    );
    setIsError(!success);
    setIsSuccess(success);
    dispatch(setIsLoading(false));
  };

  return (
    <Dialog
      open={recoverDialog}
      handler={() => {
        if (isLoading) return;
        dispatch(handleRecoverDialog());
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
          {!isLoading && !isSuccess && !isError && <h2>Ready to proceed ?</h2>}

          {isLoading && <h2>Please wait while we process your recovery</h2>}

          {isSuccess && !isLoading && <h2> Recovery Successful </h2>}

          {isError && !isLoading && <h2> Recovery failed </h2>}

          <div className="flex items-center justify-center w-full gap-2">
            {!isLoading && !isSuccess && !isError && (
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
                    dispatch(handleRecoverDialog());
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
                    handleRecovery();
                  }}
                >
                  Confirm
                </Button>
              </>
            )}

            {(isSuccess || isError) && !isLoading && (
              <Button
                color="black"
                size="lg"
                className={
                  "mt-8 rounded-full flex items-center justify-center text-lg w-[180px] " +
                  urbanist.className
                }
                onClick={() => {
                  setIsSuccess(false);
                  setIsError(false);
                  dispatch(handleRecoverDialog());
                  dispatch(setRecoveryCode(""));
                  dispatch(setPassword(""));
                  dispatch(setName(""));
                  dispatch(setWalletAddress(""));
                  router.push("/home");
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
