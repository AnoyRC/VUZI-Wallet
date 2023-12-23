"use client";

import { handleQrCodeDialog } from "@/redux/slice/dialogSlice";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function QRCodeDialog() {
  const qrCodeDialog = useSelector((state) => state.dialog.qrCodeDialog);
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.wallet.walletAddress);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (walletAddress) generateQR(walletAddress);
  }, [walletAddress]);

  const generateQR = async (text) => {
    try {
      const url = await QRCode.toDataURL(text);
      setUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      open={qrCodeDialog}
      handler={() => {
        dispatch(handleQrCodeDialog());
      }}
      className="bg-transparent flex-col shadow-none flex items-center justify-center w-1/4"
    >
      <DialogBody className="rounded-lg">
        {url && (
          <Image
            src={url}
            width={200}
            height={200}
            alt="qr code"
            className="rounded-2xl min-w-[200px]"
          />
        )}
      </DialogBody>
      <DialogFooter>
        <Button
          color="white"
          size="lg"
          className={
            " text-black rounded-full flex items-center font-normal border-black border-[1px] justify-center text-md w-[150px] bg-white -mt-5 " +
            urbanist.className
          }
          onClick={() => {
            dispatch(handleQrCodeDialog());
          }}
        >
          <>
            <X className="text-black" size={20} />
            Close
          </>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
