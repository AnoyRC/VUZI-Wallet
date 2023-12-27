"use client";

import { Dialog, DialogBody, Button } from "@material-tailwind/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Urbanist } from "next/font/google";
import { handleHorizonDialog } from "@/redux/slice/dialogSlice";
import { ArrowUpRight } from "lucide-react";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function HorizonDialog() {
  const dispatch = useDispatch();
  const horizonDialog = useSelector((state) => state.dialog.horizonDialog);

  return (
    <Dialog
      open={horizonDialog}
      handler={() => {
        dispatch(handleHorizonDialog());
      }}
      className="bg-transparent flex-col shadow-none flex items-center justify-center w-1/4 outline-none"
    >
      <DialogBody className={"rounded-lg " + urbanist.className}>
        <div className="bg-white  min-w-[450px] text-lg text-black/80 rounded-3xl flex flex-col justify-center text-center px-10 py-10">
          <div className="flex items-center justify-between">
            <p className="text-xl text-black/80 mt-1 text-start font-extrabold mr-5">
              VICTION HORIZON <br />
              STARTUP HACKATHON <br />
              <span className="font-normal italic">Payments</span>
            </p>
            <div
              className="p-7 border-black border-[1px] rounded-3xl"
              style={{
                filter: `contrast(200%) brightness(400%)`,
                background: `linear-gradient(302deg, rgba(162,54,82,1), rgba(0,0,0,0)),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            >
              <Image
                src="/victionBlack.svg"
                width={90}
                height={90}
                className="opacity-100"
                alt="Viction"
              />
            </div>
          </div>
          <div className="flex flex-col mt-3">
            <p className="text-md font-semibold text-start text-black/80">
              Team
            </p>
            <p className="text-sm font-normal text-start mt-2 text-black/80">
              <span
                className="hover:text-blue-300 transition-colors duration-200 hover:cursor-pointer flex items-center"
                onClick={() => {
                  window.open("https://twitter.com/Anoyroyc", "_blank");
                }}
              >
                {" "}
                1. Anoy Roy Chowdhury (Tech) <ArrowUpRight size={16} />{" "}
              </span>{" "}
              <span
                className="hover:text-blue-300 transition-colors duration-200 hover:cursor-pointer flex items-center"
                onClick={() => {
                  window.open("https://twitter.com/0xbaer", "_blank");
                }}
              >
                {" "}
                2. Baer.eth (Marketing and Ops) <ArrowUpRight size={16} />{" "}
              </span>{" "}
            </p>
          </div>
          {/* <div className="flex flex-col mt-3">
            <p className="text-md font-semibold text-start text-black/80">
              Possibilities & Futures
            </p>
            <p className="text-sm font-normal text-start mt-2 text-black/80">
              1. SDK for developers <br />
              2. NFT based domains <br />
              3. Multichain Wallets <br />
              4. Extentions and Apps <br />
              5. Private Transfer <br />
            </p>
          </div> */}

          <Button
            color="black"
            className="mt-5 rounded-3xl bg-black/80"
            onClick={() => {
              dispatch(handleHorizonDialog());
            }}
          >
            Close
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}
