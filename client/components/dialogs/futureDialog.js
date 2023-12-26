"use client";

import { Dialog, DialogBody, Button } from "@material-tailwind/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Urbanist } from "next/font/google";
import { handleFutureDialog } from "@/redux/slice/dialogSlice";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function FutureDialog() {
  const dispatch = useDispatch();
  const futureDialog = useSelector((state) => state.dialog.futureDialog);

  return (
    <Dialog
      open={futureDialog}
      handler={() => {
        dispatch(handleFutureDialog());
      }}
      className="bg-transparent flex-col shadow-none flex items-center justify-center w-1/4 outline-none"
    >
      <DialogBody className={"rounded-lg " + urbanist.className}>
        <div className="bg-white  min-w-[450px] text-lg text-black/80 rounded-3xl flex flex-col justify-center text-center px-10 py-10">
          <div className="flex items-center justify-between">
            <p className="text-md text-black/80 mt-1 text-start italic">
              <span className="font-bold text-3xl not-italic">V</span>iction{" "}
              <br />
              <span className="font-bold text-3xl not-italic">
                U
              </span>niversal <br />
              <span className="font-bold text-3xl not-italic">Z</span>
              ero-knowledge <br />
              <span className="font-bold text-3xl not-italic">I</span>nterface
            </p>
            <div
              className="p-7 border-black border-[1px] rounded-3xl"
              style={{
                filter: `contrast(200%) brightness(400%)`,
                background: `linear-gradient(302deg, rgba(54,79,162,1), rgba(0,0,0,0)),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            >
              <Image
                src="/logo.svg"
                width={90}
                height={90}
                className="opacity-100"
                alt="Viction"
              />
            </div>
          </div>

          <div className="flex flex-col mt-3">
            <p className="text-md font-semibold text-start text-black/80">
              Future and Possibilities
            </p>
            <div className="text-sm font-normal text-start mt-2 text-black/80 grid grid-cols-2 gap-2">
              <h3 className="border-black border-[1px] pl-2 py-1 rounded-lg">
                SDK for developers 🤖{" "}
              </h3>
              <h3 className="border-black border-[1px] pl-2 py-1 rounded-lg">
                {" "}
                NFT based domains 🌄{" "}
              </h3>
              <h3 className="border-black border-[1px] pl-2 py-1 rounded-lg">
                {" "}
                Multichain Wallets 👩‍👩‍👧‍👧{" "}
              </h3>
              <h3 className="border-black border-[1px] pl-2 py-1 rounded-lg">
                {" "}
                Extentions and Apps 🦊{" "}
              </h3>
              <h3 className="border-black pl-2 border-[1px] py-1  rounded-lg">
                {" "}
                Private Transfer 🥷{" "}
              </h3>
            </div>
          </div>

          <Button
            color="black"
            className="mt-5 rounded-3xl bg-black/80"
            onClick={() => {
              dispatch(handleFutureDialog());
            }}
          >
            Close
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}
