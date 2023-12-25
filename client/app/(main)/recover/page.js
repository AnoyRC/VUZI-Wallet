"use client";
import { Button } from "@material-tailwind/react";
import { ArrowLeft } from "lucide-react";
import { Urbanist } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import useVUZI from "@/hooks/useVUZI";
import {
  setIsLoading,
  setName,
  setPassword,
  setRecoveryCode,
  setWalletAddress,
} from "@/redux/slice/recoverSlice";
import OTPInput from "react-otp-input";
import { ArrowUpRight } from "lucide-react";
import { handleRecoverDialog } from "@/redux/slice/dialogSlice";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
});

export default function Page() {
  const router = useRouter();
  const name = useSelector((state) => state.recover.name);
  const isLoading = useSelector((state) => state.recover.isLoading);
  const { socialLogin } = useVUZI();
  const dispatch = useDispatch();
  const password = useSelector((state) => state.recover.password);
  const recoveryCode = useSelector((state) => state.recover.recoveryCode);

  const handleSocialLogin = async () => {
    dispatch(setIsLoading(true));
    const pass_id = await socialLogin();
    if (pass_id) {
      dispatch(setPassword(pass_id));
    }
    dispatch(setIsLoading(false));
  };

  return (
    <div className="flex h-[92vh] flex-col justify-between items-center z-10 max-w-[480px] min-w-[350px] w-screen p-4 px-5">
      <div className="flex flex-col w-full h-[90%] overflow-y-auto items-center no-scrollbar">
        <div className="flex flex-col justify-center items-center gap-2 mt-10">
          <div className="bg-black/70 flex items-center justify-center p-4 rounded-2xl ">
            <Image src="/logoWhite.svg" width={40} height={40} alt="logo" />
          </div>
          <div className="flex flex-col justify-between items-center">
            <h1 className="text-black/70 text-3xl font-semibold">{name}</h1>
            <h3 className="text-black/70 text-xl font-normal">@vuzi</h3>
          </div>
        </div>
        <h2 className="text-black/80 text-3xl mt-5 ">New Passcode</h2>
        <input
          className="w-full mt-5 text-3xl text-black/80 outline-none block text-center"
          placeholder="********"
          type="password"
          value={password}
          onChange={(e) => {
            dispatch(setPassword(e.target.value));
          }}
        />

        <div className="flex items-center justify-center gap-3 w-[150px] text-black/80  mt-4 mb-3">
          <div className="w-full bg-black h-[1px]" /> OR
          <div className="w-full bg-black h-[1px]" />
        </div>

        <Button
          color="white"
          size="lg"
          className={
            " rounded-full flex items-center border-black border-[1px] justify-center text-lg w-[180px] " +
            urbanist.className
          }
          onClick={() => {
            if (isLoading) return;
            handleSocialLogin();
          }}
        >
          {isLoading && <Loader2 className="animate-spin" size={24} />}
          {!isLoading && (
            <>
              <Image src="/google.svg" alt="Logo" width={20} height={20} />
              Socials
            </>
          )}
        </Button>

        <h2 className="text-black/80 text-3xl mt-3 outline-none ">
          Recovery Code
        </h2>
        <div className="w-full flex items-center mt-4">
          <OTPInput
            onChange={(e) => {
              dispatch(setRecoveryCode(e));
            }}
            value={recoveryCode}
            inputStyle="inputStyle"
            numInputs={6}
            separator={<span></span>}
            renderInput={(props) => (
              <input
                {...props}
                style={{
                  color: "black",
                  width: "100%",
                  outline: "2px solid transparent",
                  outlineOffset: "2px",
                  background: "transparent",
                  borderWidth: "1px",
                  borderColor: "black",
                  borderRadius: "10px",
                  textAlign: "center",
                  height: "60px",
                  margin: "0 5px",
                  opacity: "0.7",
                  fontSize: "30px",
                }}
                placeholder="-"
              />
            )}
          />
        </div>
        <Button
          color="white"
          size="lg"
          className={
            "mt-5 rounded-full min-h-[56px] flex items-center justify-center text-lg w-full border-[1px] border-black font-normal text-black/90 " +
            urbanist.className
          }
          style={{
            filter: `contrast(140%) brightness(1200%)`,
            background: `linear-gradient(322deg, rgba(255,0,29,1), rgba(0,0,0,0)),
             url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.18' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
          onClick={() => {
            dispatch(handleRecoverDialog());
          }}
        >
          Recovery
          <ArrowUpRight className="text-black/80" size={24} />
        </Button>
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
            "mt-3 text-black/80 rounded-full flex items-center font-normal border-black/80 border-[1px] justify-center text-md w-[180px] z-10 " +
            urbanist.className
          }
          onClick={() => {
            dispatch(setRecoveryCode(""));
            dispatch(setPassword(""));
            dispatch(setName(""));
            dispatch(setWalletAddress(""));
            router.push("/home");
          }}
        >
          <>
            <ArrowLeft className="text-black/80" size={14} />
            Back
          </>
        </Button>
      </div>
    </div>
  );
}
