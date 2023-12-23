"use client";
import { Button } from "@material-tailwind/react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import useReadContract from "@/hooks/useReadContract";
import { Loader2 } from "lucide-react";
import { Gotu } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import {
  setFlow,
  setIsLoading,
  setIsUsed,
  setName,
  setStep,
  setWalletAddress,
} from "@/redux/slice/homeSlice";

const gotu = Gotu({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Step0() {
  const inputRef = useRef(null);
  const [placeholder, setPlaceholder] = useState("Anoy");
  const { getVuzi, getVuziWallet } = useReadContract();
  const isUsed = useSelector((state) => state.home.isUsed);
  const isLoading = useSelector((state) => state.home.isLoading);
  const name = useSelector((state) => state.home.name);
  const dispatch = useDispatch();
  var timeout = setTimeout(function () {}, 0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setRandomName();
  }, []);

  const handleName = (e) => {
    if (e.target.value.length > 20) {
      dispatch(
        setName(e.target.value.slice(0, 20).replace(/[^a-zA-Z0-9]/g, ""))
      );
    } else {
      dispatch(setName(e.target.value.replace(/[^a-zA-Z0-9]/g, "")));
    }
  };

  const setRandomName = () => {
    setTimeout(() => {
      const placeholders = [
        "Anoy",
        "Jason",
        "Anik",
        "Anje",
        "Faik",
        "Nilesh",
        "Sean",
        "Matija",
        "Hrvoje",
        "Baer",
        "Sikari",
      ];
      const random = Math.floor(Math.random() * placeholders.length);
      setPlaceholder(placeholders[random]);
      setRandomName();
    }, 1000);
  };

  useEffect(() => {
    if (inputRef) {
      if (inputRef.current.value.length > 3) {
        const totalMs = name.split("m").length - 1 + name.split("M").length - 1;
        const totalWs = name.split("w").length - 1 + name.split("W").length - 1;

        if (totalMs === 0 && totalWs === 0) {
          inputRef.current.style.width = inputRef.current.value.length + "ch";
        } else {
          inputRef.current.style.width =
            inputRef.current.value.length -
            totalMs -
            totalWs +
            totalMs * 1.45 +
            totalWs * 1.45 +
            "ch";
        }
      } else {
        inputRef.current.style.width = "5ch";
      }

      inputRef.current.addEventListener("keydown", function () {
        setIsTyping(true);
        timeout = setTimeout(function () {
          setIsTyping(false);
        }, 1000);
      });
    }
  }, [name]);

  useEffect(() => {
    if (isTyping) {
      dispatch(setIsLoading(true));
    } else {
      checkVuzi();
    }
  }, [isTyping, name]);

  const checkVuzi = async () => {
    const isUsed = await getVuzi(name);
    if (isUsed) {
      const walletAddress = await getVuziWallet(name);
      dispatch(setWalletAddress(walletAddress));
    }
    dispatch(setIsUsed(isUsed));
    dispatch(setIsLoading(false));
  };
  return (
    <>
      <div className="flex items-center">
        <input
          className={
            "text-black/80 text-5xl focus:outline-none bg-transparent " +
            gotu.className
          }
          placeholder={placeholder}
          type="text"
          ref={inputRef}
          value={name}
          onChange={(e) => handleName(e)}
        ></input>

        <p className="text-black/50 text-5xl mb-[3.6px]">@vuzi</p>
      </div>
      <Button
        color="black"
        size="lg"
        className={
          "mt-8 rounded-full h-[140px] w-[140px] flex items-center justify-center text-lg " +
          gotu.className
        }
        style={{
          backgroundColor: isUsed ? "#000000" : "#ff5900",
          opacity: name.length === 0 ? 0.5 : 0.8,
        }}
        disabled={name.length === 0}
        onClick={() => {
          if (isLoading) return;
          if (isUsed) {
            dispatch(setStep(1));
            dispatch(setFlow("Enter"));
          } else {
            dispatch(setStep(1));
            dispatch(setFlow("Create"));
          }
        }}
      >
        {!isLoading ? (isUsed ? "Enter" : "Create") : ""}

        {isLoading && <Loader2 className="animate-spin text-white" size={30} />}
      </Button>
    </>
  );
}
