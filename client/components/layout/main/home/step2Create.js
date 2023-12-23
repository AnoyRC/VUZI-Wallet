"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setRecoveryCodes, setWalletAddress } from "@/redux/slice/homeSlice";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@material-tailwind/react";
import { ArrowLeft } from "lucide-react";
import { setStep, setPassword, setIsLoading } from "@/redux/slice/homeSlice";
import { Gotu } from "next/font/google";
import Image from "next/image";
import useVUZI from "@/hooks/useVUZI";
import useReadContract from "@/hooks/useReadContract";

const gotu = Gotu({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Step2Create() {
  const dispatch = useDispatch();
  const recoveryCodes = useSelector((state) => state.home.recoveryCodes);
  const isLoading = useSelector((state) => state.home.isLoading);
  const password = useSelector((state) => state.home.password);
  const name = useSelector((state) => state.home.name);
  const { deployVUZI } = useVUZI();
  const { getVuziWallet } = useReadContract();

  function generateUID() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }

  useEffect(() => {
    const codes = [];
    for (let i = 0; i < 4; i++) {
      codes.push(generateUID());
    }
    dispatch(setRecoveryCodes(codes));
  }, []);

  const handleDeployment = async () => {
    dispatch(setIsLoading(true));
    const isDeployed = await deployVUZI(recoveryCodes, password, name);
    if (isDeployed) {
      const wallet = await getVuziWallet(name);
      dispatch(setWalletAddress(wallet));
      dispatch(setStep(3));
    }
    dispatch(setIsLoading(false));
  };

  return (
    <>
      <AlertTriangle className="text-red-500 mb-5 -mt-8" size={60} />
      <h1 className="text-4xl font-bold text-black mb-1">Recovery Codes</h1>
      <p className="text-md text-black text-center mb-5">
        Please save your recovery codes in a safe location,
        <br /> They will be displayed only once.
      </p>
      <div className="grid grid-cols-2 grid-rows-2 text-black gap-5">
        {recoveryCodes.map((code) => {
          return (
            <div className="flex items-center justify-center" key={code}>
              <div className="text-4xl">{code}</div>
            </div>
          );
        })}
      </div>
      {!isLoading && (
        <>
          {" "}
          <Button
            color="white"
            size="lg"
            className={
              "mt-8 rounded-full flex items-center border-black border-[1px] justify-center text-lg w-[180px] " +
              gotu.className
            }
            onClick={() => {
              handleDeployment();
            }}
          >
            <>
              <Image
                src="/logo.svg"
                alt="Logo"
                width={20}
                height={20}
                className=""
              />
              Deploy
            </>
          </Button>
          <Button
            color="black"
            size="lg"
            className={
              "mt-4 rounded-full flex items-center justify-center text-lg w-[180px] " +
              gotu.className
            }
            onClick={() => {
              dispatch(setPassword(""));
              dispatch(setStep(1));
            }}
          >
            <ArrowLeft size={24} className="" /> Back
          </Button>
        </>
      )}

      {isLoading && (
        <div
          className={
            "flex items-center justify-center text-xl text-black mt-8 gap-2 " +
            gotu.className
          }
        >
          <Loader2
            className="text-black animate-spin "
            size={25}
            color="#000000"
          />
          Deploying
        </div>
      )}
    </>
  );
}
